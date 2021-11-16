declare type StyleSheetModule = { [key: string]: string };

declare module "*.scss" {
  const exports: StyleSheetModule;
  export default exports;
}

declare module "*.json" {
  const value: any;
  export default value;
}

declare const $: (selector: any) => any;
declare module "*.png";

interface Window {}
