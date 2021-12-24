import onChange from 'on-change';
import render from './render.js';

const watchedState = (state, text) => onChange(state, (path, value) => {
  const feedback = document.querySelector('p.feedback');
  const input = document.getElementById('url-input');
  const button = document.querySelector('[aria-label="add"]');
  const divOfFeeds = document.querySelector('.feeds');
  const divOfPosts = document.querySelector('.posts');
  const form = document.querySelector('form');

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
      render.erorrs(input, feedback, text, state.erorr);
    }
  }

  if (path === 'process') {
    switch (value) {
      case 'processed':
        feedback.textContent = '';
        disable(input, button);
        break;
      case 'failed':
        enable(input, button);
        render.erorrs(input, feedback, text, state.processError);
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

  if (path === 'update') {
    if (value === 'loaded') {
      render.posts(divOfPosts, text, state);
    }
  }
});

export default watchedState;
