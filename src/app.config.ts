export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/assets/index",
    "pages/assets/profile/index",
    "pages/assets/profile/change-password/index",
    "pages/assets/login/index",
    "pages/assets/register/index",
    "pages/statistics/index",
    "pages/edit-record/index",
    "pages/ledger-manager/index",
    "pages/ledger-manager/create/index",
    "pages/ledger-manager/update/index",
    "pages/ledger-manager/join/index",
    "pages/clockin/index",
    "pages/award-exchange/index",
  ],
  tabBar: {
    custom: true,
    list: [
      { pagePath: "pages/index/index", text: "账单" },
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
