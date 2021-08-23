/*
  @author Pete Pongpeauk (restrafes) <pete@restrafes.co>
  @author Evelyn Holloway <eholl2004@gmail.com>

  Copyright (c) 2021 EVE
  All rights reserved.
  
*/

// core imports
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// main css
import './index.scss';

// print messages
console.log(`
  EVE XCS - Client Stack

  Copyright (c) 2021 EVE
  All rights reserved.

`);
console.log(`
  This console is used for XCS developers.
  Ensure the code you're pasting into here is safe before running it, otherwise, you run the risk of losing your XCS account.
  
`);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("melody")
)
