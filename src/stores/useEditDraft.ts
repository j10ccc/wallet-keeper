import create from "zustand";

type EditDraftState = {
  record: Bill.BillRecord | null,
  setDraft: (item: Bill.BillRecord) => void;
  reset: () => void;
}

export const useEditDraft = create<EditDraftState>(set => ({
  record: null,
  setDraft: (record) => set(() => ({ record })),
  reset: () => set(() => ({ record: null }))
}));
