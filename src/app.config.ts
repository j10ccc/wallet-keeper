export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/input/index",
    "pages/assets/index",
    "pages/assets/profile/index",
    "pages/assets/profile/change-password/index",
    "pages/assets/login/index",
    "pages/assets/register/index",
    "pages/statistics/index",
    "pages/edit-record/index",
    "pages/ledger-manager/index",
    "pages/ledger-manager/create/index",
  ],
  tabBar: {
    custom: true,
    list: [
      { pagePath: "pages/index/index", text: "账单" },
      { pagePath: "pages/input/index", text: "记一笔" },
      { pagePath: "pages/assets/index", text: "资产" },
    ],
  },
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  plugins: {
    WechatSI: {
      version: "0.3.5",
      provider: "wx069ba97219f66d99",
    },
  },
});
