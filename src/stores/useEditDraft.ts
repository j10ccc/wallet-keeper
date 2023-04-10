import create from "zustand";

type InputMode = "keyboard" | "image" | "voice";

type EditDraftState = {
  record: BillAPI.DraftType | null;
  inputMode: InputMode,
  setDraft: (item: BillAPI.DraftType) => void;
  setInputMode: (index: InputMode) => void;
  reset: () => void;
};

export const useEditDraft = create<EditDraftState>((set) => ({
  record: null,
  inputMode: "keyboard",
  setDraft: (record) => set(() => ({ record })),
  setInputMode: (index) => set(() => ({ inputMode: index})),
  reset: () => set(() => ({ record: null })),
}));
