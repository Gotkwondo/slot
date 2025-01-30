const getMaxColLength = (
  data: { [key: string]: string | number | null }[],
  displayTitle: { [key: string]: string | number | null }
) => {
  if (data.length === 0) return {};
  const lengthData: { [key: string]: number } = {};
  for (let line of data) {
    for (let key in displayTitle) {
      if (lengthData[key]) {
        lengthData[key] = Math.max(
          line[key] ? `${line[key]}`.length : 0,
          lengthData[key]
        );
      }
      else lengthData[key] = line[key] ? `${line[key]}`.length : 0;
    }
  }
  return lengthData;
};

export { getMaxColLength };