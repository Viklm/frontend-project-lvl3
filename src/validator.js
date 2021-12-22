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
  console.log(links);
  const schema = yup.object().shape({
    website: yup.string().url().notOneOf(links),
  });
  // const schema = yup.string().url().notOneOf(links);
  return schema.validate({ website: url })
    .then(() => [])
    .catch((err) => {
      console.log(err, 'valid2');
      console.log(err.errors, 'valid3');
      return err.errors;
    });
};
