/** @format */
import { Component, ReactFragment } from "react";
import {
  Button,
  View,
  Text,
  Slider,
  Canvas,
  Image,
  Block
} from "@tarojs/components";
import Taro from "@tarojs/taro";
import { getGlobalData, setGlobalData, delGlobalData } from "../../global";
import * as utils from "../../utils";
import { logger } from "../../log";
import DEMO_IMG from "../../images/demo.png";
import HAT_IMG from "../../images/hat.png";

import "./index.scss";

const DEFAULT_HEIGHT = 100;
const DEFAULT_WIDTH = 100;

interface IndexProps {
  avatarPath: string;
  width: number;
  height: number;
  x: number;
  y: number;
  scale: number;
  rotate: number;
  errorMsg: string;
}

export default class Index extends Component<{}, IndexProps> {
  constructor(props) {
    super(props);
    this.state = {
      avatarPath: "",
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      x: DEFAULT_WIDTH / 2 + 10,
      y: DEFAULT_HEIGHT / 2 + 10,
      rotate: 0,
      scale: 100,
      errorMsg: ""
    };
  }
  async componentWillMount() {
    const cacheAvatarPath = getGlobalData("avatarPath");
    if (cacheAvatarPath) {
      this.handleDataCanvas({
        avatarPath: cacheAvatarPath,
        errorMsg: ""
      });
    }
  }

  componentDidMount() {
    this.handleRenderCanvas();
  }

  handleDataCanvas(data) {
    this.setState(data);
    this.handleRenderCanvas();
  }
  handleMoveHat = e => {
    const touch = e.touches[0];
    if (touch === undefined) return;
    this.handleDataCanvas({
      x: touch.x,
      y: touch.y
    });
  };
  handleRotateHat = e => {
    const val = e.detail && e.detail.value;
    if (val === undefined) return;
    this.handleDataCanvas({
      rotate: val
    });
  };
  handleScaleHat = e => {
    const val = e.detail && e.detail.value;
    if (val === undefined) return;
    this.handleDataCanvas({
      scale: val
    });
  };
  handleRenderCanvas(): void {
    const { avatarPath } = this.state;
    if (!avatarPath) return;
    const { x, y, width, height, scale, rotate } = this.state;
    const newScale = scale / 100;
    const newRotate = (rotate * Math.PI) / 180;
    const context = Taro.createCanvasContext("avatarCanvas");
    context.drawImage(avatarPath, 0, 0, 300, 300);
    context.translate(x, y);
    context.scale(newScale, newScale);
    context.rotate(newRotate);
    context.drawImage(HAT_IMG, -width / 2, -height / 2, width, height);
    context.draw();
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
      this.handleDataCanvas({ avatarPath, errorMsg: "" });
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

  renderUnauthorized(): ReactFragment {
    const { errorMsg } = this.state;
    return (
      <Block>
        <Image className="demo" src={DEMO_IMG} />
        <Text className="desc">给头像加上可爱的圣诞帽，点击使用</Text>
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

  renderAvatar(): ReactFragment {
    const { rotate, scale, errorMsg } = this.state;
    return (
      <Block>
        <Canvas
          canvasId="avatarCanvas"
          className="canvas"
          onTouchStart={this.handleMoveHat}
          onTouchMove={this.handleMoveHat}
          style="width: 300px; height: 300px;"
        />
        <View className="flexCenter">
          <Text>旋转</Text>
          <Slider
            className="slider"
            min={0}
            max={360}
            step={1}
            value={rotate}
            onChanging={this.handleRotateHat}
          />
        </View>
        <View className="flexCenter">
          <Text>缩放</Text>
          <Slider
            className="slider"
            min={20}
            max={200}
            step={1}
            value={scale}
            onChanging={this.handleScaleHat}
          />
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
        {errorMsg && <Text className="error-msg">{errorMsg}</Text>}
      </Block>
    );
  }

  render() {
    const { avatarPath } = this.state;
    return (
      <View className="container">
        <View className="contentWrapper">
          {avatarPath ? this.renderAvatar() : this.renderUnauthorized()}
        </View>
      </View>
    );
  }
}
