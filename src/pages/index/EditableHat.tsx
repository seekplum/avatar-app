/** @format */
import Taro from "@tarojs/taro";
import { Component } from "react";
import { View, Text, Slider, Canvas, Block } from "@tarojs/components";

import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  CANVAS_DELAY,
  EDITABLE_DEFAULT_WIDTH,
  EDITABLE_DEFAULT_HEIGHT
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
  scaleChanged: boolean;
  rotateChanged: boolean;
}

export default class EditableHat extends Component<Props, State> {
  static defaultProps = {
    hatImg: "",
    avatarPath: "",
    width: EDITABLE_DEFAULT_WIDTH,
    height: EDITABLE_DEFAULT_HEIGHT,
    x: 0,
    y: 0
  };
  constructor(props) {
    super(props);
    this.state = {
      x: this.props.x || EDITABLE_DEFAULT_WIDTH / 2 + 10,
      y: this.props.y || EDITABLE_DEFAULT_HEIGHT / 2 + 10,
      rotate: 0,
      scale: 100,
      scaleChanged: false,
      rotateChanged: false
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
      this.setState(values);
    }
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
  handleMoveHat = e => {
    const touch = e.touches[0];
    if (touch === undefined) return;
    this.setState({
      x: touch.x,
      y: touch.y
    });
  };
  handleChangeRotateHat = e => {
    const { rotateChanged } = this.state;
    this.setState({ rotateChanged: false });
    if (rotateChanged) {
      return;
    }
    const val = e.detail && e.detail.value;
    if (val === undefined) return;
    this.setState({
      rotate: val
    });
  };
  handleChangeScaleHat = e => {
    const { scaleChanged } = this.state;
    this.setState({ scaleChanged: false });
    if (scaleChanged) {
      return;
    }
    const val = e.detail && e.detail.value;
    if (val === undefined) return;
    this.setState({
      scale: val
    });
  };
  handleRotateHat = e => {
    const val = e.detail && e.detail.value;
    if (val === undefined) return;
    this.setState({
      rotate: val,
      rotateChanged: true
    });
  };
  handleScaleHat = e => {
    const val = e.detail && e.detail.value;
    if (val === undefined) return;
    this.setState({
      scale: val,
      scaleChanged: true
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
            onChange={this.handleChangeRotateHat}
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
            onChange={this.handleChangeScaleHat}
            onChanging={this.handleScaleHat}
          />
        </View>
      </Block>
    );
  }
}
