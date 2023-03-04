declare namespace Bill {
  interface BillRecord {
    uid: string;
    date: string; // 日期 2021-12-1
    type: string; // income | expense
    value: number; // 13.89
    kind: string; // meals
  }

  interface UploadPhoto_Data {
    filePath: string;
    type?: "default" | "train"
  }

  interface UploadPhoto_Result extends Common.IResponse<Partial<BillRecord>> {}
}
