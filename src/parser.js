export default (data, url) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(data, 'application/xml');
  const parserError = xml.querySelector('parsererror');
  if (parserError) {
    const textError = parserError.textContent;
    const err = new Error(textError);
    err.parsingFall = true;
    console.log(err);
    throw err;
  }
  const feed = {
    title: xml.querySelector('title').textContent.trim(),
    description: xml.querySelector('description').textContent.trim(),
    link: url,
  };
  const items = Array.from(xml.querySelectorAll('item'))
    .map((item) => {
      const title = item.querySelector('title').textContent.trim();
      const description = item.querySelector('description').textContent.trim();
      const link = item.querySelector('link').textContent.trim();
      const post = { title, description, link };
      return post;
    });
  return { feed, items };
};
