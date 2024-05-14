const compareDate = (date1, date2) => {
  // Extraer solo la parte de la fecha (YYYY-MM-DD)
  const datePart1 = date1.slice(0, 10);
  const datePart2 = date2.slice(0, 10);

  return datePart1 === datePart2 ? 0 : datePart1 < datePart2 ? -1 : 1;
};

module.exports = compareDate;
