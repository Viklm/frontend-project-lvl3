import * as yup from 'yup';
import watched from './view.js';

export default () => {
  const state = {
    links: [],
    form: {
      validationState: 'valid', // valid, invalid, duplicate
      process: 'filling', // filling, failed, processed, successful
      processError: null,
      error: '',
      url: '',
    },
  };
  const watchedState = watched(state);
  const schema = yup.object().shape({
    website: yup.string().url(),
  });
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url');
    schema.validate({ website: value }).then(() => {
      if (!watchedState.links.includes(value)) {
        watchedState.links.unshift(value);
        watchedState.form.validationState = 'valid';
      } else {
        watchedState.form.validationState = 'duplicate';
        watchedState.form.erorr = 'RSS уже существует';
        watchedState.form.process = 'failed';
      }
    }).catch(() => {
      watchedState.form.validationState = 'invalid';
      watchedState.form.erorr = 'Ссылка должна быть валидным URL';
      watchedState.form.process = 'failed';
    });
    form.reset();
    document.getElementById('url-input').focus();
  });
};
