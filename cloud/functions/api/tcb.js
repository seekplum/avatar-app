/** @format */

const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

let tcb = cloud;

module.exports = tcb;
