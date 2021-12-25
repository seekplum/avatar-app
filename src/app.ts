/** @format */
import Taro from "@tarojs/taro";
import { Component } from "react";
import { isMiniApp } from "./constants";
import "./app.scss";

if (isMiniApp) {
  Taro.cloud.init();
}

class App extends Component {
  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children;
  }
}

export default App;
