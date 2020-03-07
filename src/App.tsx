import React from 'react';

import PokemonPicker from './PokemonPicker';

function App() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <PokemonPicker />
      <PokemonPicker />
    </div>
  );
}

export default App;
