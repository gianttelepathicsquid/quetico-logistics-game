import React from 'react';
import LogisticsGame from './components/LogisticsGame.jsx';

function App() {
  return (
    <div style={{ 
      padding: '20px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <LogisticsGame />
    </div>
  );
}

export default App;
