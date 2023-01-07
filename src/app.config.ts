export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/input/index",
    "pages/assets/index",
  ],
  tabBar: {
    custom: true,
    list: [
      { pagePath: "pages/index/index", text: "账单"},
      { pagePath: "pages/input/index", text: "记一笔"},
      { pagePath: "pages/assets/index", text: "资产"},
    ]
  },
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black"
  }
});
