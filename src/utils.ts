// Utility functions
import dayjs, { Dayjs } from "dayjs";

// Calculate min and max dates for a given month
export const getDateRangeForMonth = (
  month: string
): { minDate: Dayjs; maxDate: Dayjs } | null => {
  if (!month) return null;

  const [monthName, year] = month.split(" ");
  const selectedMonthStart = dayjs(`${year}-${monthName}-01`);
  const selectedMonthEnd = selectedMonthStart.endOf("month");

  return {
    minDate: selectedMonthStart,
    maxDate: selectedMonthEnd,
  };
};
