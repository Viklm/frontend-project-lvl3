import onChange from 'on-change';
import render from './render.js';

const watchedState = (state, text, elements) => onChange(state, (path, value) => {
  const {
    feedback, input, button, divOfFeeds, divOfPosts, form,
  } = elements;

  const disable = (inputEl, buttonEl) => {
    inputEl.setAttribute('readonly', true);
    buttonEl.setAttribute('disabled', true);
  };
  const enable = (inputEl, buttonEl) => {
    inputEl.removeAttribute('readonly');
    buttonEl.removeAttribute('disabled');
  };

  if (path === 'form.validationState') {
    if (!value) {
      render.errors(input, feedback, text, state.error);
      enable(input, button);
    }
  }

  if (path === 'addFeedsProcess') {
    switch (value) {
      case 'processed':
        feedback.textContent = '';
        disable(input, button);
        break;
      case 'failed':
        enable(input, button);
        render.errors(input, feedback, text, state.processError);
        break;
      case 'filling':
        enable(input, button);
        break;
      case 'successful':
        enable(input, button);
        render.successFeedback(input, feedback, text);
        render.feeds(divOfFeeds, text, state);
        render.posts(divOfPosts, text, state);
        form.reset();
        document.getElementById('url-input').focus();
        break;
      default:
        throw new Error('Oops, Something went wrong!');
    }
  }

  if (path === 'feedsUpdating') {
    if (value === 'loaded') {
      render.posts(divOfPosts, text, state);
    }
  }
});

export default watchedState;
