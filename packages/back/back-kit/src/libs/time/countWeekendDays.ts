/**
 * Count weekend days on dates range
 */
export function countWeekendDays(startDate: Date, endDate: Date) {
  let count = 0;
  for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) count++;
  }
  return count;
}
