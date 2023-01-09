# Wallet-Keeper 荷包小二

一个管理个人财务收入和支出的微信小程序，支持手动和识别票据图像自动录入数据

## 背景

第十四节服务外包作品

## 特点

1. 简约脱俗的 UI 设计，符合小程序开发规范
2. 完善的流水录入体验
3. 采用图表形式，实现精准直观的财务流动统计
4. 支持识别票据图像替代手动录入数据

## 使用

```sh
npm install

npm run dev
# or 
npm run build
```

在微信开发者工具中打开`dist`目录即可

## 技术亮点

- 采用 hooks 思想构建复杂逻辑，如`useRequest`
- 使用 Zustand 自定义 storage, 在小程序端实现全局状态管理和持久化存储
- 使用 CSS-Modules 实现 React 组件的样式隔离
