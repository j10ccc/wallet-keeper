declare namespace Bill {
  interface BillRecord {
    uid: string;
    date: string; // 日期 2021-12-1
    kind: string; // income | expense
    value: number; // 13.89
    type: string; // meals
  }
}
