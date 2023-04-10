import create from "zustand";

type EditDraftState = {
  record: BillAPI.DraftType | null;
  inputMode: number,
  setDraft: (item: BillAPI.DraftType) => void;
  setInputMode: (index: number) => void;
  reset: () => void;
};

export const useEditDraft = create<EditDraftState>((set) => ({
  record: null,
  inputMode: 1,
  setDraft: (record) => set(() => ({ record })),
  setInputMode: (index) => set(() => ({ inputMode: index})),
  reset: () => set(() => ({ record: null })),
}));
