import create from "zustand";

type EditDraftState = {
  record: BillAPI.DraftType | null;
  setDraft: (item: BillAPI.DraftType) => void;
  reset: () => void;
};

export const useEditDraft = create<EditDraftState>((set) => ({
  record: null,
  setDraft: (record) => set(() => ({ record })),
  reset: () => set(() => ({ record: null })),
}));
