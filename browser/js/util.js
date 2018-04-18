const checkStrLength = (str) => {
  if (str.length > 800) {
    const truncatedStr = str.slice(0, 800);
    return `${truncatedStr}...`
  } else {
    return str;
  }
};
