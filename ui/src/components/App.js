import React from 'react';
import '../css/App.css';

import {TopBar} from "./topbar";
import {Main} from "./main";

function App() {
    // Main APP function which acts as a container for the other React Components
  return (
      <React.StrictMode>
        <TopBar />
        <Main />
      </React.StrictMode>
  );
}

export default App;
