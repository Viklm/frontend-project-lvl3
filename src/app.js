import 'bootstrap';
import _ from 'lodash';
import axios from 'axios';
import i18next from 'i18next';
import watched from './view.js';
import resources from './locales/index.js';
import parser from './parser.js';
import validator from './validator.js';

export default () => {
  const i18nextInstance = i18next.createInstance();
  return i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources,
  }).then(() => {
    const state = {
      erorr: [],
      feeds: [],
      posts: [],
      readPosts: [],
      update: null, // loading, loaded
      process: 'filling', // filling, failed, processed, successful
      processError: null,
      form: {
        validationState: null, // true, false
      },
    };

    const watchedState = watched(state, i18nextInstance);

    const getRssPath = (value) => {
      const url = new URL(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${value}`);
      return url.toString();
    };

    const timeForUpdate = 5000;
    const updatePosts = () => {
      watchedState.update = 'loading';
      const promises = watchedState.feeds.map((feed) => {
        const request = axios.get(getRssPath(feed.link))
          .then((response) => {
            const { items } = parser(response.data.contents, feed.link);
            const newItems = _.differenceWith(
              items,
              watchedState.posts,
              ({ title: newTitle }, { title }) => _.isEqual(newTitle, title),
            );
            watchedState.posts = [...newItems, ...watchedState.posts];
            watchedState.update = 'loaded';
            return null;
          })
          .catch((err) => console.log(err));
        return request;
      });
      Promise.all(promises).finally(() => setTimeout(updatePosts, timeForUpdate));
    };

    const form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const value = formData.get('url').trim();
      const links = watchedState.feeds.map((feed) => feed.link);
      watchedState.process = 'processed';
      validator(value, links)
        .then((errors) => {
          watchedState.erorr = errors;
        })
        .then(() => {
          watchedState.form.validationState = _.isEmpty(watchedState.erorr);
          if (watchedState.form.validationState) {
            watchedState.processError = null;
            axios.get(getRssPath(value))
              .then((response) => {
                const { feed, items } = parser(response.data.contents, value);
                const itemId = items.map((item) => ({ ...item, id: _.uniqueId() }));
                watchedState.feeds = [feed, ...watchedState.feeds];
                watchedState.posts = [...itemId, ...watchedState.posts];
                watchedState.process = 'successful';
              }).catch((err) => {
                if (axios.isAxiosError(err)) {
                  watchedState.processError = 'errors.network';
                }
                if (err.parsingFall) {
                  watchedState.processError = 'errors.noContent';
                }
                watchedState.process = 'failed';
              });
          }
        });
    });
    setTimeout(updatePosts, timeForUpdate);
  });
};
