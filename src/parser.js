export default (data, url) => {
  try {
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, 'application/xml');
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
  } catch (err) {
    err.parsingFall = true;
    throw err;
  }
};
