
export const getFinancialYearCode = (date: Date) => {
  const year = date.getFullYear();
  const isSecondHalf = date.getMonth() >= 3; // April onwards
  const start = isSecondHalf ? year : year - 1;
  const end = start + 1;
  return `${start}-${String(end).slice(-2)}`;
};
