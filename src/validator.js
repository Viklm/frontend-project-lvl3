import * as yup from 'yup';

export default (url, links) => {
  yup.setLocale({
    string: {
      url: 'errors.invalid',
    },
    mixed: {
      notOneOf: 'errors.duplicate',
    },
  });
  const schema = yup.string().url().notOneOf(links);
  return schema.validate(url)
    .then(() => [])
    .catch((err) => err.errors);
};
