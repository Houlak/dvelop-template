import logo from '../assets/logo.png';

function Landing() {
  return (
    <main className="min-h-[inherit] min-[block-size:inherit] grid place-content-center">
      <img 
        src={logo} 
        className="mx-auto motion-safe:animate-[spin_20s_linear_infinite]" 
        alt="" 
      />
      <h1>Houlak frontend template</h1>
      <p>This is a paragraph</p>
      <ul>
        <li>This is a list</li>
      </ul>
      <form action="">
        <div className="grid gap-2">
          <label htmlFor="text-input">Input label</label>
          <input type="text" id="text-input" placeholder="Content" />
        </div>
        <button type="submit" className="block mt-3">
          Submit
        </button>
      </form>
    </main>
  );
}

export default Landing;
