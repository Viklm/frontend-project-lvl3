export default (data) => {
  try {
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, 'application/xml');
    const feed = {
      link: xml.querySelector('link').textContent.trim(),
      title: xml.querySelector('title').textContent.trim(),
      description: xml.querySelector('description').textContent.trim(),
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
  } catch (err) {
    // const error = new Error(err);
    // error.isParsingError = true;
    // throw error;
    throw new Error(err);
  }
};
