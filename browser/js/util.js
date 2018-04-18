const checkStrLength = (str) => {
  if (str.length > 500) {
    const truncatedStr = str.slice(0, 500);
    return `${truncatedStr}...`
  } else {
    return str;
  }
};
