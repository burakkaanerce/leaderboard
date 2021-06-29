import week from 'week'

export default (date) => ({
  year: date.getFullYear(),
  week: parseInt(week(date), 10),
  day: date.getDay(),
  value: `${date.getFullYear()}_${week(date)}_${date.getDay()}`,
})
