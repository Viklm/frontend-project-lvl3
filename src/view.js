import onChange from 'on-change';

const watchedState = (state) => onChange(state, (path, value) => {
  const feedback = document.querySelector('p.feedback');
  const input = document.getElementById('url-input');
  // const form = document.querySelector('form');
  // const button = document.querySelector('[aria-label="add"]');

  if (path === 'form.validationState') {
    if (value === 'invalid') {
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      feedback.classList.remove('text-success');
      feedback.textContent = 'Ссылка должна быть валидным URL';
    }
    if (value === 'duplicate') {
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      feedback.classList.remove('text-success');
      feedback.textContent = 'RSS уже существует';
    }
  }
  // if (path === 'form.process') {
  //   if (value === 'failed') {
  //     input.setAttribute('readonly', true);
  //     button.setAttribute('disabled', true);
  //   }
  // }
});

export default watchedState;
