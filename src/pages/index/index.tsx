/** @format */
import React, { Component, ReactFragment } from "react";
import { Button, View, Text, Image, Block } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { getGlobalData, setGlobalData, clearGlobalData } from "../../global";
import * as utils from "../../utils";
import { logger } from "../../log";
import {
  HAT_CATEGORY,
  IMAGES_URL,
  CANVAS_WIDTH,
  CHRISTMAS_DEFAULT_WIDTH,
  CHRISTMAS_DEFAULT_HEIGHT
} from "../../constants";
import ChristmasHat from "./ChristmasHat";
import NationalHat from "./NationalHat";

import "./index.scss";

interface State {
  avatarPath: string;
  errorMsg: string;
  atIndex: number;
  hatImgPath: any;
}

const avatarList = [
  {
    demoImg: IMAGES_URL.DEMO_NATIONAL1,
    hatImg: IMAGES_URL.HAT_NATIONAL1,
    category: HAT_CATEGORY.NATIONAL
  },
  {
    demoImg: IMAGES_URL.DEMO_CHRISTMAS1,
    hatImg: IMAGES_URL.HAT_CHRISTMAS1,
    category: HAT_CATEGORY.CHRISTMAS,
    x: CHRISTMAS_DEFAULT_WIDTH / 2 + 10,
    y: CHRISTMAS_DEFAULT_HEIGHT / 2 + 10
  },
  {
    demoImg: IMAGES_URL.DEMO_CHRISTMAS2,
    hatImg: IMAGES_URL.HAT_CHRISTMAS2,
    category: HAT_CATEGORY.CHRISTMAS,
    x: CANVAS_WIDTH - (CHRISTMAS_DEFAULT_WIDTH / 2 + 10),
    y: CHRISTMAS_DEFAULT_HEIGHT / 2 + 10
  }
];

export default class Index extends Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      avatarPath: "",
      errorMsg: "",
      atIndex: 0,
      hatImgPath: ""
    };
  }
  async componentWillMount() {
    const cacheAvatarPath = getGlobalData("avatarPath");
    if (cacheAvatarPath && utils.checkFileExists(cacheAvatarPath)) {
      this.setState({
        avatarPath: cacheAvatarPath
      });
    }
  }
  async componentDidMount() {
    const { atIndex } = this.state;
    const hatImgPath = await this.getTempFilePath(atIndex);
    this.setState({ hatImgPath });
  }
  async handleGetUserProfile() {
    try {
      const response = await Taro.getUserProfile({
        lang: "zh_CN",
        desc: "获取你的昵称、头像、地区及性别"
      });

      const {
        userInfo: { avatarUrl }
      } = response;
      const avatarPath = await utils.downloadFile(
        utils.getBetterAvatar(avatarUrl)
      );
      setGlobalData("avatarPath", avatarPath);
      this.setState({ avatarPath, errorMsg: "" });
    } catch (err) {
      //拒绝授权
      logger.error("您拒绝了请求");
      this.setState({
        errorMsg: "授权失败，无法为您提供服务"
      });
      return;
    }
  }

  async handleReset() {
    clearGlobalData();
    await this.handleGetUserProfile();
  }

  async getTempFilePath(atIndex) {
    const at = avatarList[atIndex];
    const { hatImg } = at;
    // 本地图片，直接返回
    if (typeof hatImg !== "string") {
      return hatImg;
    }
    const cacheHatPath = getGlobalData(hatImg);
    if (cacheHatPath && utils.checkFileExists(cacheHatPath)) {
      return cacheHatPath;
    }
    const hatImgPath = await utils.downloadFile(hatImg);
    // 换成链接对应图片的临时路径
    if (typeof hatImgPath === "string") {
      setGlobalData(hatImg, hatImgPath);
    }
    return hatImgPath;
  }

  async handleCategory(atIndex: number) {
    const hatImgPath = await this.getTempFilePath(atIndex);
    this.setState({ atIndex, hatImgPath });
  }

  renderUnauthorized(): ReactFragment {
    const { errorMsg } = this.state;
    return (
      <Block>
        <Image className="demo" src={IMAGES_URL.DEMO} />
        <Text className="desc">
          给头像加上国旗🇨🇳、圣诞帽,获取头像后开始制作~
        </Text>
        <Button
          type="default"
          size="mini"
          onClick={this.handleGetUserProfile.bind(this)}
        >
          获取头像
        </Button>
        {errorMsg && <Text className="error-msg">{errorMsg}</Text>}
      </Block>
    );
  }

  renderCanvas() {
    const { atIndex, avatarPath, hatImgPath } = this.state;
    const at = avatarList[atIndex];
    if (!at) return;
    // 通过解构方式删除 category, demoImg, hatImg 字段
    const { category, demoImg, hatImg, ...args } = at;
    if (category === HAT_CATEGORY.CHRISTMAS) {
      return (
        <ChristmasHat avatarPath={avatarPath} hatImg={hatImgPath} {...args} />
      );
    } else if (category === HAT_CATEGORY.NATIONAL) {
      return (
        <NationalHat avatarPath={avatarPath} hatImg={hatImgPath} {...args} />
      );
    }
    return;
  }

  renderAvatar() {
    const { atIndex } = this.state;
    return (
      <>
        {this.renderCanvas()}
        <View className="avatarContainer">
          {avatarList.map((at, idx) => {
            const { demoImg } = at;
            const cacheDemoImg =
              typeof demoImg === "string"
                ? getGlobalData(demoImg) || demoImg
                : demoImg;
            return (
              <Image
                key={`${at.category}_${at.hatImg}`}
                className={`avatarDemo ${idx === atIndex ? "active" : ""}`}
                src={cacheDemoImg}
                onClick={() => this.handleCategory(idx)}
              />
            );
          })}
        </View>
        <View className="flexCenter buttonContainer">
          <Button
            type="default"
            size="mini"
            onClick={this.handleReset.bind(this)}
          >
            重新获取头像
          </Button>
          <Button
            type="primary"
            size="mini"
            onClick={() => {
              utils.saveCanvasToAlbum("avatarCanvas");
            }}
          >
            保存至相册
          </Button>
        </View>
      </>
    );
  }

  render() {
    const { avatarPath, errorMsg } = this.state;
    return (
      <View className="container">
        <View className="contentWrapper">
          {!!avatarPath && !errorMsg
            ? this.renderAvatar()
            : this.renderUnauthorized()}
        </View>
      </View>
    );
  }
}
