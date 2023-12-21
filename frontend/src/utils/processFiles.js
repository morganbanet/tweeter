const selectFile = ({ e, setFile, imageRef, cancelRef }) => {
  setFile(e.target.files[0]);
  const reader = new FileReader();
  reader.onload = (file) => toggleFile(file, imageRef, cancelRef);
  reader.readAsDataURL(e.target.files[0]);
};

const deselectFile = ({ setFile, imageRef, cancelRef, uploadRef }) => {
  setFile(null);
  toggleFile(null, imageRef, cancelRef);
  uploadRef.current.value = null;
};

const toggleFile = (file, imageRef, cancelRef) => {
  imageRef.current.src = file ? file.target.result : '#';
  imageRef.current.style.display = file ? 'block' : 'none';
  cancelRef.current.style.display = file ? 'inline' : 'none';
};

export { selectFile, deselectFile, toggleFile };
