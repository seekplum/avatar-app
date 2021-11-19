/** @format */

const BaseController = require("./base-controller");
const CONSTANTS = require("../constants");

class TemplateController extends BaseController {
  async list(event) {
    const templates = [
      {
        demoImg: CONSTANTS.STORAGE_PREFIX + "/images/national1.png",
        hatImg: CONSTANTS.STORAGE_PREFIX + "/images/national1.png",
        category: CONSTANTS.HAT_CATEGORY.NATIONAL
      },
      {
        demoImg: CONSTANTS.STORAGE_PREFIX + "/images/christmas1.png",
        hatImg: CONSTANTS.STORAGE_PREFIX + "/images/christmas1.png",
        category: CONSTANTS.HAT_CATEGORY.CHRISTMAS,
        x: CONSTANTS.CHRISTMAS_DEFAULT_WIDTH / 2 + 10,
        y: CONSTANTS.CHRISTMAS_DEFAULT_HEIGHT / 2 + 10
      },
      {
        demoImg: CONSTANTS.STORAGE_PREFIX + "/images/christmas2.png",
        hatImg: CONSTANTS.STORAGE_PREFIX + "/images/christmas2.png",
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
