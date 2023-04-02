import type { RecordTypeItem } from "./RecordItemList";

export interface LedgerTemplate {
  icon: string;
  name: string;

  // TODO
  recordItem?: RecordTypeItem[];
}

export const ledgerTemplateList: Array<LedgerTemplate & { color: string }> = [
  {
    icon: "baby",
    name: "宝宝账本",
    color: "#8a2be2aa",
  },
  {
    icon: "favor",
    name: "人情账本",
    color: "#ffa500aa",
  },
  {
    icon: "business",
    name: "生意账本",
    color: "#00008baa",
  },
  {
    icon: "love",
    name: "婚庆账本",
    color: "#ff0000aa",
  },
  {
    icon: "invest",
    name: "投资账本",
    color: "#daa520aa",
  },
  {
    icon: "fitment",
    name: "装修账本",
    color: "#808080aa",
  },
];
