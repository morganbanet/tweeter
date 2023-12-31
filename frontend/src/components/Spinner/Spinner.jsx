import spinner from '../../assets/spinner.gif';

function Spinner() {
  return (
    <div>
      <img src={spinner} alt="loading" className="spinner" />
    </div>
  );
}

export default Spinner;
