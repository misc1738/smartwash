import './AnimatedBrandButton.css';
import ThemeImage from '../ThemeImage';

export default function AnimatedBrandButton({ text = "SMARTWASH", onClick }) {
  return (
    <button className="brand-button" onClick={onClick}>
      {/* Logo: use theme-aware image. Expects /img/logo.jpg and /img/logo-light.jpg */}
      <span className="inline-block w-10 h-10 relative overflow-hidden rounded-md">
        <ThemeImage srcDark="/img/wheel.jpg" srcLight="/img/carwash-light.jpg" alt="SmartWash logo" className="w-10 h-10" decorative />
      </span>
      <span className="actual-text">&nbsp;{text}&nbsp;</span>
      <span aria-hidden="true" className="hover-text">&nbsp;{text}&nbsp;</span>
    </button>
  );
}
