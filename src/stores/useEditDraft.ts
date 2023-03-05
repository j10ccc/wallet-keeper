import create from "zustand";

type EditDraftState = {
  record: BillAPI.BillRecord | null,
  setDraft: (item: BillAPI.BillRecord) => void;
  reset: () => void;
}

export const useEditDraft = create<EditDraftState>(set => ({
  record: null,
  setDraft: (record) => set(() => ({ record })),
  reset: () => set(() => ({ record: null }))
}));
