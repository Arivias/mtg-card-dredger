# MTG Card Dredger

A simple cli tool for searching [Scryfall](scryfall.com) with [Ollama](https://ollama.com/) integration for filtering.

```
$ dredge f:c is:commander Jace
{
  color_identity: [ 'U' ],
  faces: [
    {
      name: "Jace, Vryn's Prodigy",
      mana_cost: '{1}{U}',
      oracle_text: "{T}: Draw a card, then discard a card. If there are five or more cards in your graveyard, exile Jace, then return him to the battlefield transformed under his owner's control.",
      power: '0',
      toughness: '2'
    },
    {
      name: 'Jace, Telepath Unbound',
      mana_cost: '',
      oracle_text: '+1: Up to one target creature gets -2/-0 until your next turn.\n' +
        '−3: You may cast target instant or sorcery card from your graveyard this turn. If that spell would be put into your graveyard, exile it instead.\n' +
        '−9: You get an emblem with "Whenever you cast a spell, target opponent mills five cards."',
      power: undefined,
      toughness: undefined
    }
  ]
}
```

## Filtering

Add an argument beginning with `??` to filter using a local Ollama server. Speed and quality will depend on the model selected and your local hardware.

```
$ dredge f:c is:commander id=wubrg "??has an effect that happens when sent to the graveyard"
{
  color_identity: [ 'B', 'G', 'R', 'U', 'W' ],
  faces: [
    {
      name: 'Azlask, the Swelling Scourge',
      mana_cost: '{3}',
      oracle_text: 'Whenever Azlask or another colorless creature you control dies, you get an experience counter.\n' +
        '{W}{U}{B}{R}{G}: Creatures you control get +X/+X until end of turn, where X is the number of experience counters you have. Scions and Spawns you control gain indestructible and annihilator 1 until end of turn.',
      power: '2',
      toughness: '2'
    }
  ]
}

...
```