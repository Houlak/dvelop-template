import logo from '../../assets/logo.png';
import './_landing.scss';

function Landing() {
  return (
    <div className="landing">
      <img src={logo} className="houlak-logo" alt="logo" />
      <p>Houlak frontend template</p>
    </div>
  );
}

export default Landing;
