import axios from 'axios';
import i18next from 'i18next';
import watched from './view.js';
import resources from './locales/index.js';
import parser from './parser.js';
import getRssPath from './routes.js';
import validator from './validator.js';

export default () => {
  const i18nextInstance = i18next.createInstance();
  return i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources,
  }).then(() => {
    const state = {
      links: [],
      feeds: [],
      posts: [],
      readPosts: [],
      form: {
        update: null, // loading, loaded
        validationState: 'valid', // valid, invalid, duplicate
        process: 'filling', // filling, failed, processed, successful
      },
    };

    const watchedState = watched(state, i18nextInstance);

    const updatePosts = () => {
      watchedState.form.update = 'loading';
      if (watchedState.links.length === 0) {
        return setTimeout(updatePosts, 5000);
      }
      const request = (path) => axios.get(getRssPath(path))
        .then((response) => parser(response.data.contents))
        .then(({ posts }) => posts);
      Promise.all(watchedState.links.map((link) => request(link)))
        .then((data) => {
          const result = data.flat();
          watchedState.posts.splice(0, watchedState.posts.length);
          watchedState.posts.unshift(...result);
          watchedState.form.update = 'loaded';
          setTimeout(updatePosts, 5000);
        });
      return true;
    };

    setTimeout(updatePosts, 5000);

    const form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const value = formData.get('url');
      validator(value, i18nextInstance).then(() => {
        if (!watchedState.links.includes(value)) {
          watchedState.links.unshift(value);
          watchedState.form.validationState = 'valid';
        } else {
          watchedState.form.validationState = 'duplicate';
        }
      }).catch(() => {
        watchedState.form.validationState = 'invalid';
      }).then(() => {
        if (watchedState.form.validationState === 'valid') {
          watchedState.form.process = 'processed';
          axios.get(getRssPath(value))
            .then((response) => {
              const data = parser(response.data.contents);
              if (data === null) {
                watchedState.links.shift();
                watchedState.form.process = 'failed';
              }
              const { feed, posts } = data;
              watchedState.feeds.unshift(feed);
              watchedState.posts.unshift(...posts);
              watchedState.form.process = 'successful';
            });
        }
      });
      form.reset();
      document.getElementById('url-input').focus();
    });
  });
};
