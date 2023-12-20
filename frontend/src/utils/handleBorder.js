export const handleControlsBorder = (controlsRef, isOpen, count) => {
  controlsRef.current.style.marginBottom =
    isOpen || count.commentCount > 0 ? '0.59rem' : '0';
  controlsRef.current.style.borderBottom =
    isOpen || count.commentCount > 0 ? '1px solid #f2f2f2' : 'none';
};

export const handleFormsBorder = (formRef, count) => {
  formRef.current.style.paddingBottom =
    count.commentCount > 0 ? '0.62rem' : '0';
  formRef.current.style.borderBottom =
    count.commentCount > 0 ? '1px solid #f2f2f2' : 'none';
};
