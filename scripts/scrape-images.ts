const fs = require('fs');
const stream = require('stream');
const util = require('util');
const path = require('path');
// @ts-ignore
const fetch = require('node-fetch');

const { SPECIES } = require('@smogon/calc');
const { escapeFilename } = require('../src/util/escapeFilename');

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
    .replace(/^cherrim-sunshine/, 'cherrim-sunny')
    .replace(/^sinistea-antique/, 'sinistea')
    .replace(/^polteageist-antique/, 'polteageist')
    .replace(/^giratina$/, 'giratina-altered')
    .replace(/^eiscue$/, 'eiscue-ice')
    .replace(/^lycanroc$/, 'lycanroc-midday')
    .replace(/^morpeko$/, 'morpeko-full-belly')
    .replace(/^wishiwashi$/, 'wishiwashi-solo')
    .replace(/^indeedee$/, 'indeedee-male')
    .replace(/^meowstic$/, 'meowstic-male')
    .replace(/^urshifu$/, 'urshifu-single-strike')
    .replace(/^urshifu-gmax$/, 'urshifu-single-strike-gmax')
    .replace(/^arceus.*/, 'arceus')
    .replace(/^cramorant.*/, 'cramorant')
    .replace(/^silvally.*/, 'silvally')
    .replace(/^pumpkaboo.*/, 'pumpkaboo')
    .replace(/^gourgeist.*/, 'gourgeist')
    .replace(/-alola$/, '-alolan')
    .replace(/-galar/, '-galarian')
    .replace(/^(zacian|zamazenta)$/, '$1-hero')
    .replace(/^(calyrex-.*)$/, '$1-rider')
    .replace(/(?<!nidoran)-f$/, '-female')
    .replace(/gmax$/, 'gigantamax')
    .replace(/[^a-z0-9-]/g, '');
  const url = `https://img.pokemondb.net/artwork/large/${pokemonDbName}.jpg`;
  const fsSafeName = escapeFilename(species);
  const filePath = path.join(__dirname, `../public/images/pokemon/${fsSafeName}.jpg`);

  if (fs.existsSync(filePath)) {
    return;
  }

  try {
    console.log('FETCH:', species);
    // @ts-ignore
    const response = await fetch(url, { timeout: FETCH_TIMEOUT });
    if (!response.ok) {
      console.warn('IMAGE NOT FOUND:', species, pokemonDbName);
    } else {
      console.log('SAVING:', species);
      await pipeline(response.body, fs.createWriteStream(filePath));
      console.log('SAVED:', species);
    }
  } catch (e) {
    console.debug(e);

    if (fs.existsSync(filePath)) {
      console.log('CLEANING UP FILE:', species);
      fs.unlinkSync(filePath);
    }

    console.warn('RETRYING FETCH FOR:', species);
    await new Promise((resolve) => global.setTimeout(resolve, 20000));
    await collectImage(species);
  }
};

const main = async () => {
  await Promise.all(SPECIES_NAMES.map(collectImage));
  process.exit(0);
};

main();
