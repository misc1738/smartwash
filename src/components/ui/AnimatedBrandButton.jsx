import './AnimatedBrandButton.css';

export default function AnimatedBrandButton({ text = "SMARTWASH", onClick }) {
  return (
    <button className="brand-button" onClick={onClick}>
      {/* Logo image removed to preserve original animated text design */}
      <span className="actual-text">&nbsp;{text}&nbsp;</span>
      <span aria-hidden="true" className="hover-text">&nbsp;{text}&nbsp;</span>
    </button>
  );
}
