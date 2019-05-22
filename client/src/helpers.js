
export const sortIntoCategories = (allReports) => {
  const sales = new Map();
  const stocks = new Map();
  allReports.forEach(r => {
    if (r.type === 2) {
      // "To", i.e. sale
      sales.set(`${r.name}-${r.type}`, r);
    } else if (r.type === 1) {
      stocks.set(`${r.name}-${r.type}`, r);
    }
  });
  return {
    to: sales,
    from: stocks
  };
};
