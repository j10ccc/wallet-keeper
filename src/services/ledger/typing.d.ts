declare namespace LedgerAPI {
  interface Ledger {
    id: number;
    name: string;
    isPublic: boolean;
    /** 账本创建者的用户名 */
    owner: string;
    /** 模板-记账场景 */
    template: string;
  }

  interface FetchItem_Result
    extends Common.IResponse<Array<Omit<Ledger, "isPublic"> & {
      is_public: boolean;
    }>> {}

  interface CreateItem_Data {
    name: string;
    is_public: boolean;
    template: string;
  }

  interface CreateItem_Result extends Common.IResponse<Ledger["id"]> {}

  interface UpdateItem_Data extends Omit<Ledger, "isPublic" | "owner" | "template"> {
    is_public: boolean;
  }

  interface UpdateItem_Result extends Common.IResponse<null> {}

  interface DeleteItem_Data {
    id: number;
  }

  interface DeleteItem_Result extends Common.IResponse<null> {}

  interface FetchShareCode_Data {
    ledger_id: number;
  }

  interface FetchShareCode_Result extends Common.IResponse<string> {}

  interface JoinLedger_Data {
    code: string;
  }

  interface JoinLedger_Result extends Common.IResponse<null> {}

}
