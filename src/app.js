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
      erorrs: [],
      links: [],
      feeds: [],
      posts: [],
      readPosts: [],
      form: {
        validationState: null, // true, false
        update: null, // loading, loaded
        process: 'filling', // filling, failed, processed, successful, no-connect
        processError: null,
      },
    };

    const watchedState = watched(state, i18nextInstance);

    const getRssPath = (value) => {
      const url = new URL(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${value}`);
      return url.toString();
    };

    // const updateTime = 5000;
    // const updatePosts = () => {
    //   const promises = watchedState.feeds.map((feed) => axios
    //     .get(getRssPath(feed.link))
    //     .then((response) => {
    //       const { posts: updatePosts1 } = parser(response.data.contents);
    //       const currentPosts = watchedState.posts
    //         .filter((post) => post.feedId === feed.id)
    //         .map((post) => post.title);
    //       const newPosts = updatePosts1.filter((post) => !currentPosts.includes(post.title));
    //       const newPostsId = newPosts.map((post) => ({
    //         ...post,
    //         feedId: feed.id,
    //         id: _.uniqueId(),
    //       }));
    //       watchedState.posts = [...newPostsId, ...watchedState.posts];
    //     })
    //     .catch((err) => {
    //       console.error(err);
    //     }));
    //     Promise.all(promises).finally(() => setTimeout(updatePosts(), updateTime));
    // };
    // setTimeout(updatePosts(), updateTime);
    // const updateTime = 5000;
    // const updatePosts = () => {
    //   watchedState.form.update = 'loading';
    //   const request = (path) => axios.get(getRssPath(path))
    //     .then((response) => parser(response.data.contents))
    //     .then(({ posts }) => posts);
    //   Promise.all(watchedState.feeds.map((feed) => request(feed.link)))
    //     .then((data) => {
    //       const result = data.flat();
    //       const diff = _.differenceWith(result, watchedState.posts, _.isEqual);
    //       watchedState.posts.splice(0, watchedState.posts.length);
    //       watchedState.posts.unshift(...diff);
    //       watchedState.form.update = 'loaded';
    //       setTimeout(updatePosts, updateTime);
    //     })
    //     .catch((e) => {
    //       console.log(e);
    //       watchedState.form.update = 'loading';
    //       updatePosts();
    //     });
    //   return true;
    // };

    // setTimeout(updatePosts, updateTime);

    const form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const value = formData.get('url').trim();
      const links = watchedState.feeds.map((feed) => feed.link);
      validator(value, links)
        .then((errors) => {
          watchedState.errors = [...errors];
          console.log(errors, 'then');
          console.log(watchedState.erorrs, 'then2');
        })
        .then(() => {
          watchedState.form.validationState = _.isEmpty(watchedState.errors);
          if (watchedState.form.validationState) {
            watchedState.form.process = 'processed';
            watchedState.form.processError = null;
            axios.get(getRssPath(value))
              .then((response) => {
                const { feed, items } = parser(response.data.contents);
                const feedId = { ...feed, id: _.uniqueId() };
                const itemId = items.map((item) => ({
                  ...item, id: _.uniqueId(), feedId: feedId.id }));
                watchedState.feeds = [feedId, ...watchedState.feeds];
                watchedState.posts = [...itemId, ...watchedState.posts];
                watchedState.form.process = 'successful';
              }).catch((err) => {
                console.log(err, 'valid55');
                watchedState.form.process = 'failed';
                if (axios.isAxiosError(err)) {
                  watchedState.form.processError = i18nextInstance.t('errors.network');
                }
                if (err.isParsingError) {
                  watchedState.form.processError = i18nextInstance.t('errors.noContent');
                }
              });
          }
        });
    });
  });
};
