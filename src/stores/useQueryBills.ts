import create from "zustand";

type QueryBillsState = {
  date: { year: number, month: number};
  type: "default" | "income" | "expense";
  setDate: (year: number, month: number) => void;
  setType: (type: "default" | "income" | "expense") => void;
}

export const useQueryBills = create<QueryBillsState>( set => ({
  date: {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  },
  type: "default",
  setDate: (year, month) => set(() => ({
    date: { year, month }
  })),
  setType: (value) => set(() => ({type: value}))
}));
