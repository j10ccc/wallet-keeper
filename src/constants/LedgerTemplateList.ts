import { expenseItemList, incomeItemList, RecordKindType } from "./RecordItemList";

export interface LedgerTemplate {
  icon: string;
  name: string;
  incomeKinds: RecordKindType[];
  expenseKinds: RecordKindType[];
}

export const ledgerTemplateList: Array<LedgerTemplate & { color: string }> = [
  {
    icon: "none",
    name: "默认场景",
    color: "#8a2be2aa",
    incomeKinds: incomeItemList,
    expenseKinds: expenseItemList
  },
  {
    icon: "baby",
    name: "宝宝账本",
    color: "#8a2be2aa",
    expenseKinds: [
      { label: "婴儿用品", value: "baby-daily" },
      { label: "婴儿食品", value: "kid-food" },
      { label: "学费", value: "school" },
      { label: "医疗费用", value: "treatment" },
    ],
    incomeKinds: []
  },
  {
    icon: "favor",
    name: "人情账本",
    color: "#ffa500aa",
    expenseKinds: [],
    incomeKinds: []
  },
  {
    icon: "business",
    name: "生意账本",
    color: "#00008baa",
    expenseKinds: [
      { label: "营销成本", value: "marketing" },
      { label: "生产成本", value: "produce" },
      { label: "物流成本", value: "transport" },
      { label: "人力资源", value: "worker" },
      { label: "技术和研发", value: "lab"},
      { label: "税费", value: "revenue "},
      { label: "法律咨询", value: "consult" },
      { label: "地租", value: "house" },
    ],
    incomeKinds: [
      { label: "营销收入", value: "salary" },
      { label: "版权专利", value: "patent" },
      { label: "投资收益", value: "stock" },
      { label: "加盟费", value: "alimony" },
    ]
  },
  {
    icon: "love",
    name: "婚庆账本",
    color: "#ff0000aa",
    expenseKinds: [
      { label: "穿着化妆", value: "makeup" },
      { label: "花卉装饰", value: "flower" },
      { label: "摄影摄像", value: "camera" },
      { label: "婚礼策划", value: "consult" },
      { label: "钻戒五金", value: "diamond" },
      { label: "烟酒糖果", value: "wine" },
    ],
    incomeKinds: [{
      label: "礼金",
      value: "redenvelope"
    }]
  },
  {
    icon: "invest",
    name: "投资账本",
    color: "#daa520aa",
    expenseKinds: [],
    incomeKinds: []
  },
  {
    icon: "fitment",
    name: "装修账本",
    color: "#808080aa",
    expenseKinds: [],
    incomeKinds: []
  },
];
