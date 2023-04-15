export type RecordKindType = {
  label: string;
  value: string; // consist with iconName
}

export const expenseItemList: RecordKindType[] = [
  {label: "三餐", value: "meals"},
  {label: "日用品", value: "daily"},
  {label: "交通", value: "transit"},
  {label: "零食", value: "food"},
  {label: "衣服", value: "clothes"},
  {label: "发红包", value: "redenvelope"},
  {label: "运动", value: "sports"},
  {label: "话费网费", value: "calls"},
  {label: "旅游", value: "trip"},
  {label: "宠物", value: "pets"},
  {label: "学习", value: "school"},
  {label: "医疗", value: "treatment"},
  {label: "娱乐", value: "fun"},
  {label: "住房", value: "house"},
  {label: "电器数码", value: "digit"},
  {label: "汽车/加油", value: "oil"},
  {label: "美妆", value: "makeup"},
  {label: "其他", value: "other"},
];

export const incomeItemList: RecordKindType[] = [
  {label: "工资", value: "salary"},
  {label: "生活费", value: "alimony"},
  {label: "收红包", value: "redenvelope"},
  {label: "股票基金", value: "stock"},
  {label: "其他", value: "other"},
];

export const itemValueLabelMap = Object.fromEntries([
  ...expenseItemList,
  ...incomeItemList,
].map(item => [item.value, item.label]));
