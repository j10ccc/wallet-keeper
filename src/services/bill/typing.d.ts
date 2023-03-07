declare namespace BillAPI {
  interface BillRecord {
    id?: number; // remote id
    uid: string;
    date: string; // 日期 2021-12-1
    type: string; // income | expense
    value: number; // 13.89
    kind: string; // meals
  }

  interface DateIndex {
    /** YYYY-MM */
    date: string;
    /** index of current date start item */
    index: number;
    length: number;
  }

  interface UploadPhoto_Data {
    filePath: string;
    type?: "default" | "train"
  }

  interface UploadPhoto_Result extends Common.IResponse<Partial<BillRecord>> {}

  interface InsertItem_Data extends Omit<BillRecord, "id" | "type" | "value"> {
    value: string;
    type: boolean
  }

  interface InsertItem_Result extends Common.IResponse<number> {}

  interface UpdateItem_Data extends Omit<BillRecord, "value">{
    value: string;
  }

  interface UpdateItem_Result extends Common.IResponse<number> {}

  interface DeleteItem_Data { id: string; }

  interface DeleteItem_Result extends Common.IResponse<null> {}

  interface FetchItems_Data {
    /** e.g. 2023-01-28 */
    date?: string;
    /** e.g. 2020-01 */
    month?: string;
    /** e.g. 2023 */
    year?: string;
    /** 0: income, 1: expense */
    type?: 0 | 1;
    page_num: number;
    page_size: number;
  }

  interface FetchItems_Result extends Common.IResponse<{
    // TODO:
  }> {}

  interface UploadVoiceWords_Data {
    sentence: string;
  }

  interface UploadVoiceWords_Result extends Common.IResponse<
    Partial<BillRecord>
  > {}

}
