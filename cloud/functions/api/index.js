/** @format */

// 云函数入口文件
const TcbRouter = require("tcb-router");
const TemplateController = require("./controllers/template");

const api = {
  template: new TemplateController()
};

exports.main = (event, context) => {
  const app = new TcbRouter({ event });

  app.use(async (ctx, next) => {
    ctx.data = {};
    await next();
  });

  app.router("template/list", async ctx => {
    ctx.body = await api.template.list(event);
  });

  return app.serve();
};
