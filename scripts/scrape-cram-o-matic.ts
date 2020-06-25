const fs = require('fs');
const path = require('path');
// @ts-ignore
const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

// const SEREBII_PAGE = 'https://www.serebii.net/swordshield/cram-o-matic.shtml';
const BULBAPEDIA_PAGE = 'https://bulbapedia.bulbagarden.net/wiki/Cram-o-matic';

const printInputs = (document: Document) => {
  const inputs = [...document.querySelector('table:nth-of-type(4)').querySelectorAll('tbody > tr')]
    .map((tr) => [...tr.querySelectorAll('td')])
    .map((row) => row.slice(1).map((td) => td.textContent.trim()))
    .filter((row) => row.length === 3);

  const inputJson = JSON.stringify(inputs, undefined, 2);
  const filePath = path.join(__dirname, `../src/assets/cram-o-matic-inputs.json`);
  fs.writeFileSync(filePath, inputJson);
};

const main = async () => {
  const response = await fetch(BULBAPEDIA_PAGE);
  const html = await response.text();
  const { document } = new JSDOM(html).window;

  // const resultTable = [...document.querySelectorAll('table')][13];

  // const rows = [...resultTable.querySelectorAll('tr')]
  //   .map((tr: HTMLTableRowElement) => {
  //     const tds = [...tr.querySelectorAll('td')];
  //     return tds.map((td) => td.innerText);
  //   })
  //   .filter((row: any[]) => row.length > 1);

  // rows.forEach((row) => console.log(row));

  printInputs(document);
};

main();
