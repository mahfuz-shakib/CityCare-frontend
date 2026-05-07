const getMonth = (month) => {
  const prev = [...month];
  prev[1]--;
  if (prev[1] < 1) {
    prev[0]--;
    prev[1] = 12;
  }
  return prev;
};
const getMonthlyItems = (month, items) => {
  return items.map((s) => new Date(s.createdAt).toISOString().slice(0, 7)).filter((s) => s === month).length;
};
export const monthlyDataResolution = (items) => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const last6months = [currentMonth.split("-").map((x) => Number(x))];
  for (let i = 1; i <= 5; i++) {
    last6months.push(getMonth(last6months[i - 1]));
  }
  const final6Months = last6months
    .map((m) => m.join("-"))
    .map((m) => (m.length === 7 ? m : m.slice(0, 5) + "0" + m.slice(5)));
  const data = {};
  final6Months.forEach((m) => {
    data[m] = (data[m] || 0) + getMonthlyItems(m, items);
  });
  const keys = Object.keys(data).reverse();
  const values = Object.values(data).reverse();
  console.log(keys, values);
  for (let i = 1; i <= 5; i++) {
    values[i] += values[i - 1];
    data[keys[i]] = values[i];
  }
  console.log(data);
  return data;
};
