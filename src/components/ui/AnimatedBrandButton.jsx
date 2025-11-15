import './AnimatedBrandButton.css';

export default function AnimatedBrandButton({ text = "SMARTWASH", onClick }) {
  return (
    <button className="brand-button" onClick={onClick}>
      <span className="actual-text">&nbsp;{text}&nbsp;</span>
      <span aria-hidden="true" className="hover-text">&nbsp;{text}&nbsp;</span>
    </button>
  );
}
