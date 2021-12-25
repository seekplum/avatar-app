/** @format */
import Taro from "@tarojs/taro";
import { Component } from "react";
import { View, Text, Slider, Canvas } from "@tarojs/components";

import {
  cropperCanvasId,
  canvasStyle,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  CANVAS_DELAY,
  EDITABLE_DEFAULT_WIDTH,
  EDITABLE_DEFAULT_HEIGHT
} from "../../constants";

import "./index.scss";

interface Props {
  hatImg: string | HTMLImageElement;
  avatarPath: string | HTMLImageElement;
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
    this.onDelayRenderCanvas();
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
  onMoveHat = e => {
    const touch = e.touches[0];
    if (touch === undefined) return;
    this.setState({
      x: touch.x,
      y: touch.y
    });
  };
  onChangeRotateHat = e => {
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
  onChangeScaleHat = e => {
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
  onRotateHat = e => {
    const val = e.detail && e.detail.value;
    if (val === undefined) return;
    this.setState({
      rotate: val,
      rotateChanged: true
    });
  };
  onScaleHat = e => {
    const val = e.detail && e.detail.value;
    if (val === undefined) return;
    this.setState({
      scale: val,
      scaleChanged: true
    });
  };
  onRenderCanvas(): void {
    const { avatarPath, hatImg } = this.props;
    if (!avatarPath || !hatImg) return;
    const { width, height } = this.props;
    const { x, y, scale, rotate } = this.state;
    const newScale = scale / 100;
    const newRotate = (rotate * Math.PI) / 180;
    const context = Taro.createCanvasContext(cropperCanvasId);
    // 清除画布内容
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.save();
    let avatarOptions, hatImgOptions;
    if (typeof avatarPath === "string" && typeof hatImg === "string") {
      avatarOptions = [avatarPath, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT];
      hatImgOptions = [hatImg, -width / 2, -height / 2, width, height];
    } else {
      const aHeight = avatarPath.height;
      const aWidth = avatarPath.width;
      // const tHeight = hatImg.height;
      // const tWidth = hatImg.width;
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
      hatImgOptions = [hatImg, -width / 2, -height / 2, width, height / 2];
    }
    context.drawImage(...avatarOptions);
    // 坐标参考调整
    context.translate(x, y);
    // 缩放调整
    context.scale(newScale, newScale);
    // 旋转调整
    context.rotate(newRotate);
    context.drawImage(...hatImgOptions);
    context.draw();
    context.restore();
  }

  render() {
    const { rotate, scale } = this.state;
    return (
      <>
        <Canvas
          canvasId={cropperCanvasId}
          className="canvas"
          onTouchStart={this.onMoveHat}
          onTouchMove={this.onMoveHat}
          style={canvasStyle}
        />
        <View className="flexCenter">
          <Text>旋转</Text>
          <Slider
            className="slider"
            min={0}
            max={360}
            step={1}
            value={rotate}
            onChange={this.onChangeRotateHat}
            onChanging={this.onRotateHat}
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
            onChange={this.onChangeScaleHat}
            onChanging={this.onScaleHat}
          />
        </View>
      </>
    );
  }
}
