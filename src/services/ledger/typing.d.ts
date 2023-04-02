declare namespace LedgerAPI {
  interface Ledger {
    id: number;
    name: string;
    isPublic: boolean;
  }

  interface FetchItem_Result
    extends Common.IResponse<Array<Omit<Ledger, "isPublic">>> {}

  interface CreateItem_Data {
    name: string;
    is_public: boolean;
  }

  interface CreateItem_Result extends Common.IResponse<Ledger["id"]> {}

  interface UpdateItem_Data extends Omit<Ledger, "isPublic"> {
    is_public: boolean;
  }

  interface UpdateItem_Result extends Common.IResponse<null> {}

  interface DeleteItem_Data {
    id: number;
  }

  interface DeleteItem_Result extends Common.IResponse<null> {}
}
