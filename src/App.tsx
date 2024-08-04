import React from 'react';
import logo from './logo.svg';
import './App.css';
import TicTacToe from './components/body';
import WebRTCWithSocketIO from './components/peer';
import Sidebar from './components/sidebar';

function App() {
  return (
    <>
      <Sidebar />
      <WebRTCWithSocketIO />
      <TicTacToe />
    </>
  );
}

export default App;
