const checkStrLength = (str) => {
  if (str.length > 500) {
    const truncatedStr = str.slice(0, 500);
    return `${truncatedStr}...`
  } else {
    return str;
  }
};

const makeDateReadable = (str) => {
  let dateArr = str.split('-');
  const trimDateDetail = dateArr[2].slice(0, 2);
  const readableDate = `${dateArr[0]}-${dateArr[1]}-${trimDateDetail}`;
  return readableDate;
}
