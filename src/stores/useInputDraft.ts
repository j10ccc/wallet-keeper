import { expenseItemList } from "@/pages/constants/RecordItemList";
import create from "zustand";

type InputDraftState = {
  date: string;
  value: number;
  type: string;
  kind: string;
  setDate: (value: string) => void;
  setValue: (value: number) => void;
  setType: (value: string) => void;
  setKind: (value: string) => void;
  resetDraft: () => void;
}

export const useInputDraft = create<InputDraftState>(set => ({
  date: new Date().toLocaleDateString().split("/").join("-"),
  value: 0,
  type: expenseItemList[0].value,
  kind: "expense",
  setDate: (value) => set(() => ({date: value})),
  setValue: (value) => set(() => ({value: value})),
  setType: (value) => set(() => ({type: value})),
  setKind: (value) => set(() => ({kind: value})),
  resetDraft: () => set({
    date: new Date().toLocaleDateString().split("/").join("-"),
    value: 0,
    type: expenseItemList[0].value,
    // kind: "expense",
  }),

}));
