export default (data) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(data, 'application/xml');
  const parserError = xml.querySelector('parsererror');
  if (parserError) {
    throw new Error('Error parsing XML');
  }
  const feed = {
    id: xml.querySelector('link').textContent.trim(),
    title: xml.querySelector('title').textContent.trim(),
    description: xml.querySelector('description').textContent.trim(),
  };
  const listOfPosts = Array.from(xml.querySelectorAll('item'));
  const posts = [];
  listOfPosts.forEach((post) => {
    const feedByPostId = feed.id;
    const postId = post.querySelector('guid').textContent.trim();
    const postTitle = post.querySelector('title').textContent.trim();
    const postDescription = post.querySelector('description').textContent.trim();
    const postLink = post.querySelector('link').textContent.trim();
    posts.push({
      feedByPostId, postId, postTitle, postDescription, postLink,
    });
  });
  return { feed, posts };
};
