export default (value) => `https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(value)}`;
