import { LedgerTemplate, ledgerTemplateList } from "@/constants/LedgerTemplateList";

const getTemplateKindLabelMap = (template: LedgerTemplate) => {
  return Object.fromEntries([
    ...template.expenseKinds,
    ...template.incomeKinds,
  ].map(item => [item.value, item.label]));
};

const getTemplate = (ledger?: LedgerAPI.Ledger) => {
  if (!ledger) return ledgerTemplateList[0];
  else {
    const targetTemplate = ledgerTemplateList.find(template =>
      template.name === ledger?.template
    );
    return targetTemplate || ledgerTemplateList[0];
  }
};

const getLedger = (id: number | undefined, ledgers: LedgerAPI.Ledger[]) => {
  if (!id) return undefined;
  else {
    const targetLedger = ledgers.find(item => item.id === id);
    return targetLedger;
  }
};

export default {
  getLedger,
  getTemplate,
  getTemplateKindLabelMap,
};
