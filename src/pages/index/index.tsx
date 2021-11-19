/** @format */
import React, { Component, ReactFragment } from "react";
import { Button, View, Text, Image, Block } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { getGlobalData, setGlobalData, delGlobalData } from "../../global";
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
      atIndex: 0
    };
  }

  componentWillMount() {
    const cacheAvatarPath = getGlobalData("avatarPath");
    if (cacheAvatarPath) {
      this.setState({
        avatarPath: cacheAvatarPath
      });
    }
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
    delGlobalData("avatarPath");
    await this.handleGetUserProfile();
  }

  async handleCategory(atIndex: number) {
    this.setState({ atIndex });
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
    const { atIndex, avatarPath } = this.state;
    const at = avatarList[atIndex];
    if (!at) return;
    const { category, demoImg, ...args } = at;
    if (category === HAT_CATEGORY.CHRISTMAS) {
      return <ChristmasHat avatarPath={avatarPath} {...args} />;
    } else if (category === HAT_CATEGORY.NATIONAL) {
      return <NationalHat avatarPath={avatarPath} {...args} />;
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
            return (
              <Image
                key={`${at.category}_${at.hatImg}`}
                className={`avatarDemo ${idx === atIndex ? "active" : ""}`}
                src={at.demoImg}
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
