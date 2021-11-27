/** @format */
import React, { Component, ReactFragment } from "react";
import { Button, View, Text, Image, Block } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { getGlobalData, setGlobalData } from "../../global";
import * as utils from "../../utils";
import { logger } from "../../log";
import {
  AVATAR_FORM,
  HAT_CATEGORY,
  IMAGES_URL,
  DEFAULT_EXPIRE
} from "../../constants";

import EditableHat from "./EditableHat";
import ShowOnlyHat from "./ShowOnlyHat";

import "./index.scss";

interface State {
  avatarPath: string;
  errorMsg: string;
  atIndex: number;
  hatImgPath: any;
  templates: Array<any>;
  step: number;
}

export default class Index extends Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      avatarPath: "",
      errorMsg: "",
      atIndex: 0,
      hatImgPath: "",
      templates: [],
      step: 1
    };
  }
  async componentWillMount() {
    const cacheAvatarPath = getGlobalData("avatarPath");
    if (cacheAvatarPath && utils.checkFileExists(cacheAvatarPath)) {
      this.setState({
        avatarPath: cacheAvatarPath,
        step: 2
      });
    }
    await this.getTemplates();
  }
  async componentDidMount() {
    await this.getHatImg();
  }
  onShareAppMessage({ from: string, target }) {
    return {
      title: "邀请好友一起来更换头像吧~",
      imageUrl: IMAGES_URL.DEMO,
      path: "pages/index/index"
    };
  }
  async getHatImg() {
    const { atIndex, hatImgPath } = this.state;
    if (hatImgPath) return;
    const cacheHatImgPath = this.getCacheHatImg(atIndex);
    if (cacheHatImgPath) {
      this.setState({ hatImgPath: cacheHatImgPath });
      return;
    }
    const tempHatImgPath = await this.getTempFilePath(atIndex);
    if (tempHatImgPath) {
      this.setState({ hatImgPath: tempHatImgPath });
    }
  }
  async getTemplates() {
    // 优先从缓存中获取
    const cacheTemplates = getGlobalData("templates");
    if (cacheTemplates) {
      try {
        const templates = JSON.parse(cacheTemplates);
        this.setState({ templates });
        await this.getHatImg();
        return;
      } catch (error) {
        logger.error("模板数据被损坏:", cacheTemplates);
      }
    }
    try {
      const response = await Taro.cloud.callFunction({
        name: "api",
        data: {
          $url: "template/list"
        }
      });
      const {
        result: {
          data: { templates }
        }
      } = response;
      this.setState({ templates });
      setGlobalData("templates", JSON.stringify(templates), DEFAULT_EXPIRE);
      await this.getHatImg();
    } catch (error) {
      logger.error("获取模板列表失败:", error);
      this.setState({ errorMsg: "服务异常，可以向开发者反馈解决。" });
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
      this.setState({ avatarPath, errorMsg: "", step: 2 });
    } catch (err) {
      //拒绝授权
      logger.error("您拒绝了请求");
      this.setState({
        errorMsg: "您拒绝了授权，继续使用请重试~"
      });
      return;
    }
    await this.getTemplates();
  }

  async handlePrev() {
    this.setState({ step: 1 });
  }

  async handleChooseImage(way) {
    try {
      const res = await Taro.chooseImage({
        count: 1,
        sourceType: [way]
      });
      const avatarPath = res.tempFilePaths[0];
      setGlobalData("avatarPath", avatarPath);
      this.setState({ avatarPath, errorMsg: "", step: 2 });
    } catch (err) {
      logger.error("从相册选择图片失败:", err);
      this.setState({ errorMsg: "从相册选择图片失败，请重试~" });
      return;
    }
    await this.getTemplates();
  }

  getCacheHatImg(atIndex: number) {
    const { templates } = this.state;
    const at = templates[atIndex];
    if (!at) return;
    const { hatImg } = at;
    // 本地图片，直接返回
    if (typeof hatImg !== "string") {
      return hatImg;
    }
    const cacheHatPath = getGlobalData(hatImg);
    if (cacheHatPath && utils.checkFileExists(cacheHatPath)) {
      return cacheHatPath;
    }
  }

  async getTempFilePath(atIndex) {
    const cacheHatImgPath = this.getCacheHatImg(atIndex);
    if (cacheHatImgPath) return cacheHatImgPath;
    const { templates } = this.state;
    const at = templates[atIndex];
    if (!at) return;
    const { hatImg } = at;
    try {
      const hatImgPath = await utils.downloadFile(hatImg);
      // 换成链接对应图片的临时路径
      if (typeof hatImgPath === "string") {
        setGlobalData(hatImg, hatImgPath);
      }
      return hatImgPath;
    } catch (error) {
      this.setState({ errorMsg: "请重新获取头像后再试~" });
    }
  }

  async handleCategory(atIndex: number) {
    const hatImgPath = await this.getTempFilePath(atIndex);
    if (hatImgPath) {
      this.setState({ atIndex, hatImgPath });
    }
  }

  renderUnauthorized(): ReactFragment {
    const { errorMsg } = this.state;
    return (
      <Block>
        <Image className="demo" src={IMAGES_URL.DEMO} />
        <Text className="desc">
          给头像加上国旗🇨🇳、圣诞帽,获取头像后开始制作~
        </Text>
        <View className="flexCenter buttonContainer">
          <Button
            type="default"
            size="mini"
            onClick={this.handleChooseImage.bind(this, AVATAR_FORM.ALBUM)}
          >
            相册中选择
          </Button>
          <Button
            type="primary"
            size="mini"
            onClick={this.handleGetUserProfile.bind(this)}
          >
            获取头像
          </Button>
        </View>
        {errorMsg && <Text className="error-msg">{errorMsg}</Text>}
      </Block>
    );
  }

  renderCanvas() {
    const { atIndex, avatarPath, hatImgPath, templates } = this.state;
    const at = templates[atIndex];
    if (!at) return;
    // 通过解构方式删除 category, demoImg, hatImg 字段
    const { category, demoImg, hatImg, ...args } = at;
    if (category === HAT_CATEGORY.EDITABLE) {
      return (
        <EditableHat avatarPath={avatarPath} hatImg={hatImgPath} {...args} />
      );
    } else if (category === HAT_CATEGORY.SHOW_ONLY) {
      return (
        <ShowOnlyHat avatarPath={avatarPath} hatImg={hatImgPath} {...args} />
      );
    }
    return;
  }

  renderAvatar() {
    const { atIndex, templates } = this.state;
    return (
      <>
        {this.renderCanvas()}
        <View className="avatarContainer">
          {templates.map((at, idx) => {
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
            onClick={this.handlePrev.bind(this)}
          >
            重新选择头像
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
    const { avatarPath, hatImgPath, errorMsg, step } = this.state;
    return (
      <View className="container">
        <View className="contentWrapper">
          {!!avatarPath && !!hatImgPath && !errorMsg && step === 2
            ? this.renderAvatar()
            : this.renderUnauthorized()}
        </View>
      </View>
    );
  }
}
