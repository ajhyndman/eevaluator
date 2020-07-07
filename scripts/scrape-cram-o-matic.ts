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

const printOutputs = (document: Document) => {
  const outputTable = document.querySelector('table:nth-of-type(3)');
  const rows = [...outputTable.querySelectorAll('tbody > tr + tr + tr')];
  const outputs = rows
    // drop headers and footer
    .filter((row) => row.childNodes.length > 2)
    .map((row) => {
      const [first, ...rest] = row.querySelectorAll('td');
      const type = first.textContent.trim();
      const items = rest.map((td) => td.querySelector('a').title);
      return [type, items];
    });

  const outputJson = JSON.stringify(outputs, undefined, 2);
  const filePath = path.join(__dirname, `../src/assets/cram-o-matic-outputs.json`);
  fs.writeFileSync(filePath, outputJson);
};

const main = async () => {
  const response = await fetch(BULBAPEDIA_PAGE);
  const html = await response.text();
  const { document } = new JSDOM(html).window;

  printInputs(document);
  printOutputs(document);
};

main();
