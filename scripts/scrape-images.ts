const fs = require('fs');
// @ts-ignore
const fetch = require('node-fetch');
const path = require('path');

const { SPECIES } = require('@smogon/calc');

const collectImage = async (species: string) => {
  const pokemonDbName = species
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/^eiscue$/, 'eiscue-ice')
    .replace(/^lycanroc$/, 'lycanroc-midday')
    .replace(/^morpeko$/, 'morpeko-full-belly')
    .replace(/^wishiwashi$/, 'wishiwashi-solo')
    .replace(/-alola$/, '-alolan')
    .replace(/-galar$/, '-galarian')
    .replace(/-f$/, '-female')
    .replace(/gmax$/, 'gigantamax')
    .replace(/-totem$/, '')
    .replace(/[^a-z0-9-]/g, '');
  const url = `https://img.pokemondb.net/artwork/large/${pokemonDbName}.jpg`;
  const filePath = path.join(__dirname, `../public/pokemon/${species}.jpg`);

  try {
    console.log('FETCH:', species);
    const response = await fetch(url);
    if (!response.ok) {
      console.warn('IMAGE NOT FOUND:', species);
    } else {
      console.log('SAVED:', species);
      const file = fs.createWriteStream(filePath);
      // @ts-ignore
      await response.body.pipe(file);
    }
  } catch (e) {
    console.warn('RETRYING FETCH FOR:', species);
    await new Promise((resolve, reject) =>
      global.setTimeout(() => {
        collectImage(species)
          .then(resolve)
          .catch(reject);
      }, 20000),
    );
  }
};

const main = async () => {
  await Promise.all(Object.keys(SPECIES[8]).map(collectImage));
  process.exit(0);
};

main();
