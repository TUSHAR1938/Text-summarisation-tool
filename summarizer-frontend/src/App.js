import React, { useState } from 'react';
import './App.css';
import Summary from './components/Summary';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`App ${darkMode ? 'dark-theme' : ''}`}>
      <div className="container">
        <div className="theme-toggle">
          <input
            type="checkbox"
            id="toggle"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <label htmlFor="toggle" className="toggle-label">
            <span className="icon sun" title="Light Mode">
              🌞
            </span>
            <span className="icon moon" title="Dark Mode">
              🌙
            </span>
            <span className="ball"></span>
          </label>
        </div>

        <Summary />
      </div>
    </div>
  );
}

export default App;
