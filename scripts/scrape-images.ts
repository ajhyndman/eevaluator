const fs = require('fs');
const stream = require('stream');
const util = require('util');
const path = require('path');
// @ts-ignore
const fetch = require('node-fetch');

const { SPECIES } = require('@smogon/calc');

// Without a timeout, TCP connection failures can cause a request to hang
// forever.
// https://github.com/node-fetch/node-fetch/issues/309
const FETCH_TIMEOUT = 5000;
const SPECIES_NAMES = Object.keys(SPECIES[8]);

const pipeline = util.promisify(stream.pipeline);

const collectImage = async (species: string) => {
  const pokemonDbName = species
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/-totem$/, '')
    .replace(/^eiscue$/, 'eiscue-ice')
    .replace(/^lycanroc$/, 'lycanroc-midday')
    .replace(/^morpeko$/, 'morpeko-full-belly')
    .replace(/^wishiwashi$/, 'wishiwashi-solo')
    .replace(/^indeedee$/, 'indeedee-male')
    .replace(/^meowstic$/, 'meowstic-male')
    .replace(/^arceus.*/, 'arceus')
    .replace(/^silvally.*/, 'silvally')
    .replace(/^pumpkaboo.*/, 'pumpkaboo')
    .replace(/^gourgeist.*/, 'gourgeist')
    .replace(/-alola$/, '-alolan')
    .replace(/-galar$/, '-galarian')
    .replace(/-f$/, '-female')
    .replace(/gmax$/, 'gigantamax')
    .replace(/[^a-z0-9-]/g, '');
  const url = `https://img.pokemondb.net/artwork/large/${pokemonDbName}.jpg`;
  const filePath = path.join(__dirname, `../public/pokemon/${species}.jpg`);
  // const fileHandle = await fsPromises.open(filePath, 'w');

  try {
    console.log('FETCH:', species);
    // @ts-ignore
    const response = await fetch(url, { timeout: FETCH_TIMEOUT });
    if (!response.ok) {
      console.warn('IMAGE NOT FOUND:', species);
      // await fileHandle.close();
    } else {
      console.log('SAVING:', species);
      await pipeline(response.body, fs.createWriteStream(filePath));
      // // @ts-ignore
      // const buffer = await response.buffer();
      // await fileHandle.write(buffer);
      // await fileHandle.close();
      // console.log('SAVED:', species);
    }
  } catch (e) {
    console.debug(e);
    console.warn('RETRYING FETCH FOR:', species);
    // await fileHandle.close();
    await new Promise(resolve => global.setTimeout(resolve, 20000));
    await collectImage(species);
  }
};

const main = async () => {
  await Promise.all(SPECIES_NAMES.map(collectImage));
  process.exit(0);
};

main();
