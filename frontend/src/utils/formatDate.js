const formatDate = (val) => {
  const date = new Date(val);

  const options = {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  };

  return date.toLocaleString('en-GB', options).split(',').join(' at');
};

export default formatDate;
