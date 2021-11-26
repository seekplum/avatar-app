/** @format */

import Taro from "@tarojs/taro";
import { Component } from "react";
import { Canvas, Block } from "@tarojs/components";
import { CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS_DELAY } from "../../constants";

import "./index.scss";

interface Props {
  hatImg: string;
  avatarPath: string;
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
    this.handleDelayRenderCanvas();
  }
  componentDidUpdate(prevProps, prevState) {
    const needUpdate =
      prevProps.hatImg !== this.props.hatImg ||
      prevProps.avatarPath !== this.props.avatarPath;
    if (needUpdate) {
      this.handleDelayRenderCanvas();
    } else if (prevState !== this.state) {
      this.handleRenderCanvas();
    }
  }
  handleDelayRenderCanvas(): void {
    setTimeout(() => {
      this.handleRenderCanvas();
    }, CANVAS_DELAY);
  }
  handleRenderCanvas(): void {
    const { avatarPath, hatImg } = this.props;
    if (!avatarPath || !hatImg) return;
    const { dx, dy, dWidth, dHeight } = this.props;
    const context = Taro.createCanvasContext("avatarCanvas");
    // 清除画布内容
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.drawImage(avatarPath, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.drawImage(hatImg, dx, dy, dWidth, dHeight);
    context.draw();
  }

  render() {
    return (
      <Block>
        <Canvas
          canvasId="avatarCanvas"
          className="canvas"
          style={`width: ${CANVAS_WIDTH}px; height: ${CANVAS_HEIGHT}px;`}
        />
      </Block>
    );
  }
}
