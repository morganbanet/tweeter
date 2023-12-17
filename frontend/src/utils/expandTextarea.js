const expandTextarea = (e, maxHeight) => {
  const textarea = e.target;

  textarea.style.height === maxHeight + 'px'
    ? (textarea.style.overflow = 'visible')
    : (textarea.style.overflow = 'hidden');

  textarea.style.height = '';
  textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
};

export default expandTextarea;
