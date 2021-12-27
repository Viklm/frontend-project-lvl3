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
      error: [],
      feeds: [],
      posts: [],
      readPosts: [],
      feedsUpdating: 'launch', // loading, loaded
      addFeedsProcess: 'filling', // filling, failed, processed, successful
      processError: null,
      form: {
        validationState: true, // true, false
      },
    };

    const elements = {
      feedback: document.querySelector('p.feedback'),
      input: document.getElementById('url-input'),
      button: document.querySelector('[aria-label="add"]'),
      divOfFeeds: document.querySelector('.feeds'),
      divOfPosts: document.querySelector('.posts'),
      form: document.querySelector('form'),
    };

    const watchedState = watched(state, i18nextInstance, elements);

    const getRssPath = (value) => {
      const url = new URL('https://hexlet-allorigins.herokuapp.com/get');
      url.searchParams.set('disableCache', 'true');
      url.searchParams.set('url', value);
      return url.toString();
    };

    const timeForUpdate = 5000;
    const updatePosts = () => {
      watchedState.feedsUpdating = 'loading';
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
            watchedState.feedsUpdating = 'loaded';
            return null;
          })
          .catch((err) => console.log(err));
        return request;
      });
      Promise.all(promises).finally(() => setTimeout(updatePosts, timeForUpdate));
    };

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const value = formData.get('url').trim();
      const links = watchedState.feeds.map((feed) => feed.link);
      watchedState.addFeedsProcess = 'processed';
      validator(value, links)
        .then((data) => {
          watchedState.processError = null;
          axios.get(getRssPath(data))
            .then((response) => {
              const { feed, items } = parser(response.data.contents, value);
              const itemId = items.map((item) => ({ ...item, id: _.uniqueId() }));
              watchedState.feeds = [feed, ...watchedState.feeds];
              watchedState.posts = [...itemId, ...watchedState.posts];
              watchedState.addFeedsProcess = 'successful';
            }).catch((err) => {
              if (axios.isAxiosError(err)) {
                watchedState.processError = 'errors.network';
              }
              if (err.parsingFall) {
                watchedState.processError = 'errors.noContent';
              }
              watchedState.addFeedsProcess = 'failed';
            });
        }).catch((err) => {
          watchedState.error = err.errors;
          watchedState.form.validationState = false;
        });
    });
    setTimeout(updatePosts, timeForUpdate);
  });
};
