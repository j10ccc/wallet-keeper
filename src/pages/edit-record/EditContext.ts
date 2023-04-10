import {createContext } from "react";
import type { KindSelectorRef } from "@/components/KindSelector";
import type { AmountViewerRef } from "./AmountViewer";

const EditContext = createContext<{
  kindSelectorRef: React.RefObject<KindSelectorRef> | null;
  amountViewerRef: React.RefObject<AmountViewerRef> | null;
  recordRef: React.MutableRefObject<BillAPI.DraftType> | null;
  updateEffect: (value: Partial<BillAPI.DraftType>) => void;
    }>({
      kindSelectorRef: null,
      amountViewerRef: null,
      recordRef: null,
      updateEffect: (_:Partial<BillAPI.DraftType>) => {
        // do nothing
      }
    });

export default EditContext;
