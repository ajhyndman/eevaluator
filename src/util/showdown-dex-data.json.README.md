This json data should be depended on explicitly, but as proof of concept, I
generated it by running the following on
https://play.pokemonshowdown.com/teambuilder.

```javascript
JSON.stringify({
  ...Object.entries(BattlePokedex).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value.num }),
    {},
  ),
  ...BattlePokemonIconIndexes,
  ...BattlePokemonIconIndexesLeft,
});
```