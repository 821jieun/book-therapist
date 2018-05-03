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

//check if entry even has a title
//if not, then don't bother displaying the entry
const checkIfEntryHasBookTitle = (recArray) => {

  const recArrayWithTitles = [];

  recArray.forEach((rec) => {
      console.log(rec.books.title)
    if (rec.books.title) {
      recArrayWithTitles.push(rec)
    }
  // recArray.forEach((entry) => {
  //   if (!(entry.books.title === 'n/a')) {
  //     recArrayWithTitles.push(entry)
  //   }

  });
  return recArrayWithTitles;
}

//extract book information
const extractBookInformation = (bookArray) => {
  //book array looks like this
  //book[0] = {description: lala, author: lala, title: lala, image: lala}

  return bookArray.map((book) => {
    let description = book.description;
    description = checkStrLength(description);

    const {author, title, image} = book;
    return {
      "author": author,
      "title": title,
      "image": image,
      "description": description
    }
  })
}
