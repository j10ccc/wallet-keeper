import create from "zustand";

type TabState = {
  tabIndex: number;
  setTabIndex: (tabIndex: number) => void;
}

export const useTab = create<TabState>(set => ({
  tabIndex: 0,
  setTabIndex: (tabIndex) => set(() => ({ tabIndex }))
}));
