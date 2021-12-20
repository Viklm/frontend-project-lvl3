export default {
  erorrs: (input, feedback, text) => {
    input.classList.add('is-invalid');
    feedback.classList.add('text-danger');
    feedback.classList.remove('text-success');
    const textNode = document.createTextNode(text);
    feedback.replaceChildren(textNode);
  },
  posts: (divOfPosts, text, state) => {
    const container = document.createElement('div');
    container.classList.add('card', 'border-0');
    const div = document.createElement('div');
    div.classList.add('cart-body');
    const h2 = document.createElement('h2');
    h2.textContent = text.t('posts.post');
    h2.classList.add('card-title', 'h4');
    div.append(h2);
    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');

    state.posts.forEach((element) => {
      const {
        postId, postTitle, postDescription, postLink,
      } = element;

      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      const a = document.createElement('a');
      if (state.readPosts.includes(postId)) {
        a.classList.add('fw-normal', 'link-secondary');
      } else {
        a.classList.add('fw-bold');
      }
      a.setAttribute('href', postLink);
      a.setAttribute('data-id', postId);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      a.textContent = postTitle;

      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.setAttribute('data-id', postId);
      button.setAttribute('data-bs-toggle', 'modal');
      button.setAttribute('data-bs-target', '#modal');
      button.textContent = text.t('posts.button');

      button.addEventListener('click', () => {
        const closeButton = document.getElementById('closeButton');
        closeButton.textContent = text.t('modal.closeButton');
        const readButton = document.getElementById('readMore');
        readButton.textContent = text.t('modal.readButton');
        readButton.setAttribute('href', postLink);
        const modalTitle = document.querySelector('.modal-title');
        modalTitle.textContent = postTitle;
        const modalBody = document.querySelector('.modal-body');
        modalBody.textContent = postDescription;
        a.classList.remove('fw-bold');
        a.classList.add('fw-normal', 'link-secondary');
        state.readPosts.push(postId);
      });

      li.append(a, button);
      ul.append(li);
    });
    container.append(div, ul);
    divOfPosts.replaceChildren(container);
  },
  feeds: (divOfFeeds, text, { feeds }) => {
    const container = document.createElement('div');
    container.classList.add('card', 'border-0');
    const div = document.createElement('div');
    div.classList.add('cart-body');
    const h2 = document.createElement('h2');
    h2.textContent = text.t('feeds.feed');
    h2.classList.add('card-title', 'h4');
    div.append(h2);
    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');
    feeds.forEach((element) => {
      const { title, description } = element;
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'border-0', 'border-end-0');
      const h3 = document.createElement('h3');
      h3.classList.add('h6', 'm-0');
      h3.textContent = title;
      const p = document.createElement('p');
      p.classList.add('m-0', 'small', 'text-black-50');
      p.textContent = description;
      li.append(h3, p);
      ul.append(li);
    });

    container.append(div, ul);
    divOfFeeds.replaceChildren(container);
  },
  successFeedback: (input, feedback, text) => {
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    const textNode = document.createTextNode(text.t('successful'));
    feedback.replaceChildren(textNode);
  },
};
