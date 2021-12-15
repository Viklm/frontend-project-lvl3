import * as yup from 'yup';

export default (url, text) => {
  yup.setLocale({
    string: {
      url: () => text.t('errors.invalid'),
    },
  });
  const schema = yup.object().shape({
    website: yup.string().url(),
  });
  return schema.validate({ website: url });
};
