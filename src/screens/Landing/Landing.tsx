import logo from '../../assets/logo.png';
import './_landing.scss';

function Landing() {
  return (
    <main className="landing">
      <img src={logo} className="houlak-logo" alt="" />
      <h1>Houlak frontend template</h1>
      <p>This is a paragraph</p>
      <ul>
        <li>This is a list</li>
      </ul>
      <form action="">
        <div style={{ display: 'grid', gap: 8 }}>
          <label htmlFor="text-input">Input label</label>
          <input type="text" id="text-input" placeholder="Content" />
        </div>
        <button type="submit" style={{ display: 'block', marginBlockStart: 12 }}>
          Submit
        </button>
      </form>
    </main>
  );
}

export default Landing;
