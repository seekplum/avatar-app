/** @format */

const BaseController = require("./base-controller");
const CONSTANTS = require("../constants");

class TemplateController extends BaseController {
  async list(event) {
    const templates = [
      {
        demoImg: CONSTANTS.IMAGES_URL.DEMO_NATIONAL1,
        hatImg: CONSTANTS.IMAGES_URL.HAT_NATIONAL1,
        category: CONSTANTS.HAT_CATEGORY.NATIONAL
      },
      {
        demoImg: CONSTANTS.IMAGES_URL.DEMO_CHRISTMAS1,
        hatImg: CONSTANTS.IMAGES_URL.HAT_CHRISTMAS1,
        category: CONSTANTS.HAT_CATEGORY.CHRISTMAS,
        x: CONSTANTS.CHRISTMAS_DEFAULT_WIDTH / 2 + 10,
        y: CONSTANTS.CHRISTMAS_DEFAULT_HEIGHT / 2 + 10
      },
      {
        demoImg: CONSTANTS.IMAGES_URL.DEMO_CHRISTMAS2,
        hatImg: CONSTANTS.IMAGES_URL.HAT_CHRISTMAS2,
        category: CONSTANTS.HAT_CATEGORY.CHRISTMAS,
        x:
          CONSTANTS.CANVAS_WIDTH - (CONSTANTS.CHRISTMAS_DEFAULT_WIDTH / 2 + 10),
        y: CONSTANTS.CHRISTMAS_DEFAULT_HEIGHT / 2 + 10
      }
    ];
    return this.success({
      templates
    });
  }
}

module.exports = TemplateController;
