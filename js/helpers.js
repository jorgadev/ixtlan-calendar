export function getFirstDayOfMonth(year, month) {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  let firstDayOfWeek = firstDayOfMonth.getDay();
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  return firstDayOfWeek;
}

export function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

export function isValidDate(date) {
  return date instanceof Date && !isNaN(date.valueOf());
}
