import logo from './logo.svg';
import './App.css';
import isElectron from 'is-electron';

function App() {
  var Name = "Not known";
  if (navigator.appVersion.indexOf("Win") != -1) Name =
      "Windows OS";
  if (navigator.appVersion.indexOf("Mac") != -1) Name =
      "MacOS";
  if (navigator.appVersion.indexOf("X11") != -1) Name =
      "UNIX OS";
  if (navigator.appVersion.indexOf("Linux") != -1) Name =
      "Linux OS";
  console.log(Name);
  console.log('Is electron' + isElectron());

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
