/** @format */
import Taro from "@tarojs/taro";
import { Component } from "react";
import { View, Text, Slider, Canvas, Block } from "@tarojs/components";

import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  CANVAS_DELAY,
  CHRISTMAS_DEFAULT_WIDTH,
  CHRISTMAS_DEFAULT_HEIGHT
} from "../../constants";

import "./index.scss";

interface Props {
  hatImg: string;
  avatarPath: string;
  width: number;
  height: number;
  x?: number;
  y?: number;
}
interface State {
  x: number;
  y: number;
  scale: number;
  rotate: number;
}

export default class ChristmasHat extends Component<Props, State> {
  static defaultProps = {
    hatImg: "",
    avatarPath: "",
    width: CHRISTMAS_DEFAULT_WIDTH,
    height: CHRISTMAS_DEFAULT_HEIGHT,
    x: 0,
    y: 0
  };
  constructor(props) {
    super(props);
    this.state = {
      x: this.props.x || CHRISTMAS_DEFAULT_WIDTH / 2 + 10,
      y: this.props.y || CHRISTMAS_DEFAULT_HEIGHT / 2 + 10,
      rotate: 0,
      scale: 100
    };
  }
  componentDidMount() {
    this.handleDelayRenderCanvas();
  }
  componentWillReceiveProps(nextProps: Props) {
    let values = {};
    if (nextProps.x !== this.state.x) {
      values = { ...values, x: nextProps.x };
    }
    if (nextProps.y !== this.state.y) {
      values = { ...values, y: nextProps.y };
    }
    if (Object.keys(values).length > 0) {
      values = { ...values, rotate: 0, scale: 100 };
      this.handleDataCanvas(values);
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const needUpdate =
      prevProps.hatImg !== this.props.hatImg ||
      prevProps.avatarPath !== this.props.avatarPath;
    if (needUpdate) {
      this.handleDelayRenderCanvas();
    }
  }
  handleDelayRenderCanvas(): void {
    setTimeout(() => {
      this.handleRenderCanvas();
    }, CANVAS_DELAY);
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
    const { avatarPath, hatImg } = this.props;
    if (!avatarPath || !hatImg) return;
    const { width, height } = this.props;
    const { x, y, scale, rotate } = this.state;
    const newScale = scale / 100;
    const newRotate = (rotate * Math.PI) / 180;
    const context = Taro.createCanvasContext("avatarCanvas");
    context.drawImage(avatarPath, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // 坐标参考调整
    context.translate(x, y);
    // 缩放调整
    context.scale(newScale, newScale);
    // 旋转调整
    context.rotate(newRotate);
    context.drawImage(hatImg, -width / 2, -height / 2, width, height);
    context.draw();
  }

  render() {
    const { rotate, scale } = this.state;
    return (
      <Block>
        <Canvas
          canvasId="avatarCanvas"
          className="canvas"
          onTouchStart={this.handleMoveHat}
          onTouchMove={this.handleMoveHat}
          style={`width: ${CANVAS_WIDTH}px; height: ${CANVAS_HEIGHT}px;`}
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
      </Block>
    );
  }
}
