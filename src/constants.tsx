import { CSSProperties } from "react";
import * as utils from "./utils";

export const isMiniApp = utils.isMiniApp();
export const isH5App = utils.isH5App();

export const CANVAS_WIDTH = 300;
export const CANVAS_HEIGHT = 300;
export const CANVAS_DELAY = 100;
export const DEFAULT_EXPIRE = 60 * 60;

export const EDITABLE_DEFAULT_HEIGHT = 110.81;
export const EDITABLE_DEFAULT_WIDTH = 100;
export const HAT_CATEGORY = {
  EDITABLE: "editable",
  SHOW_ONLY: "show_only"
};

export const STORAGE_PREFIX =
  "cloud://seekplum-6gqnvlnl5ce6b5f1.7365-seekplum-6gqnvlnl5ce6b5f1-1308378299";
export const IMAGE_PREFIX = "https://img.alicdn.com/imgextra";

export const IMAGES_URL = {
  DEMO: `${IMAGE_PREFIX}/i4/1131344432/O1CN01oGupme1ibu5VTUCxh_!!1131344432.png`
};

export const cropperCanvasId = "avatarCanvas";
export const canvasStyle: CSSProperties = {
  width: `${CANVAS_WIDTH}px`,
  height: `${CANVAS_HEIGHT}px`
};
export const CDN_TEMPLATES = [
  {
    demoImg: `${IMAGE_PREFIX}/i3/1131344432/O1CN015HdgaG1ibu5VTcw4a_!!1131344432.png`,
    hatImg: `${IMAGE_PREFIX}/i3/1131344432/O1CN015HdgaG1ibu5VTcw4a_!!1131344432.png`,
    category: HAT_CATEGORY.SHOW_ONLY
  },
  {
    demoImg: `${IMAGE_PREFIX}/i1/1131344432/O1CN010TVEb71ibu5VTLLcM_!!1131344432.png`,
    hatImg: `${IMAGE_PREFIX}/i1/1131344432/O1CN010TVEb71ibu5VTLLcM_!!1131344432.png`,
    category: HAT_CATEGORY.SHOW_ONLY
  },
  {
    demoImg: `${IMAGE_PREFIX}/i2/1131344432/O1CN01ssij3t1ibu5L0zRwn_!!1131344432.png`,
    hatImg: `${IMAGE_PREFIX}/i2/1131344432/O1CN01ssij3t1ibu5L0zRwn_!!1131344432.png`,
    category: HAT_CATEGORY.SHOW_ONLY
  },
  {
    demoImg: `${IMAGE_PREFIX}/i4/1131344432/O1CN01tt0Td51ibu5Pm0AWM_!!1131344432.png`,
    hatImg: `${IMAGE_PREFIX}/i4/1131344432/O1CN01tt0Td51ibu5Pm0AWM_!!1131344432.png`,
    category: HAT_CATEGORY.SHOW_ONLY
  },
  {
    demoImg: `${IMAGE_PREFIX}/i1/1131344432/O1CN01AYKJme1ibu5SUpIrW_!!1131344432.png`,
    hatImg: `${IMAGE_PREFIX}/i1/1131344432/O1CN01AYKJme1ibu5SUpIrW_!!1131344432.png`,
    category: HAT_CATEGORY.SHOW_ONLY
  },
  {
    demoImg: `${IMAGE_PREFIX}/i2/1131344432/O1CN010zhQEl1ibu5Nm3gVt_!!1131344432.png`,
    hatImg: `${IMAGE_PREFIX}/i2/1131344432/O1CN010zhQEl1ibu5Nm3gVt_!!1131344432.png`,
    category: HAT_CATEGORY.SHOW_ONLY
  },
  {
    demoImg: `${IMAGE_PREFIX}/i3/1131344432/O1CN013bzsqU1ibu5W8ojHk_!!1131344432.png`,
    hatImg: `${IMAGE_PREFIX}/i3/1131344432/O1CN013bzsqU1ibu5W8ojHk_!!1131344432.png`,
    category: HAT_CATEGORY.EDITABLE,
    x: EDITABLE_DEFAULT_WIDTH / 2 + 10,
    y: EDITABLE_DEFAULT_HEIGHT / 2 + 10
  },
  {
    demoImg: `${IMAGE_PREFIX}/i2/1131344432/O1CN01i1Ap4R1ibu5JTKG9W_!!1131344432.png`,
    hatImg: `${IMAGE_PREFIX}/i2/1131344432/O1CN01i1Ap4R1ibu5JTKG9W_!!1131344432.png`,
    category: HAT_CATEGORY.EDITABLE,
    x: CANVAS_WIDTH - (EDITABLE_DEFAULT_WIDTH / 2 + 10),
    y: EDITABLE_DEFAULT_HEIGHT / 2 + 10
  }
];

export const AVATAR_FORM = {
  CAMERA: "camera", // 相机
  ALBUM: "album" // 相册
};
