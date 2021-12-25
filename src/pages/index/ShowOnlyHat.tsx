/** @format */

import Taro from "@tarojs/taro";
import { Component } from "react";
import { Canvas } from "@tarojs/components";
import {
  cropperCanvasId,
  canvasStyle,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  CANVAS_DELAY
} from "../../constants";

import "./index.scss";

interface Props {
  hatImg: string | HTMLImageElement;
  avatarPath: string | HTMLImageElement;
  dx: number;
  dy: number;
  dWidth: number;
  dHeight: number;
}
interface State {}

export default class ShowOnlyHat extends Component<Props, State> {
  static defaultProps = {
    avatarPath: "",
    dx: 0,
    dy: 0,
    dWidth: CANVAS_WIDTH,
    dHeight: CANVAS_HEIGHT
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.onDelayRenderCanvas();
  }
  componentDidUpdate(prevProps, prevState) {
    const needUpdate =
      prevProps.hatImg !== this.props.hatImg ||
      prevProps.avatarPath !== this.props.avatarPath;
    if (needUpdate) {
      this.onDelayRenderCanvas();
    } else if (prevState !== this.state) {
      this.onRenderCanvas();
    }
  }
  onDelayRenderCanvas(): void {
    setTimeout(() => {
      this.onRenderCanvas();
    }, CANVAS_DELAY);
  }
  onRenderCanvas(): void {
    const { avatarPath, hatImg } = this.props;
    if (!avatarPath || !hatImg) return;
    const { dx, dy, dWidth, dHeight } = this.props;
    const context = Taro.createCanvasContext(cropperCanvasId);
    // 清除画布内容
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    let avatarOptions, hatImgOptions;
    if (typeof avatarPath === "string") {
      avatarOptions = [avatarPath, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT];
      hatImgOptions = [hatImg, dx, dy, dWidth, dHeight];
    } else {
      const aHeight = avatarPath.height;
      const aWidth = avatarPath.width;
      const tHeight = hatImg.height;
      const tWidth = hatImg.height;
      avatarOptions = [
        avatarPath,
        0,
        0,
        aWidth,
        aHeight * 2,
        0,
        0,
        CANVAS_WIDTH,
        CANVAS_HEIGHT
      ];
      hatImgOptions = [
        hatImg,
        dx,
        dy,
        tWidth,
        tHeight * 2,
        0,
        0,
        dWidth,
        dHeight
      ];
    }
    context.drawImage(...avatarOptions);
    context.drawImage(...hatImgOptions);
    context.draw();
  }

  render() {
    return (
      <Canvas
        canvasId={cropperCanvasId}
        className="canvas"
        style={canvasStyle}
      />
    );
  }
}
