# Shattered Hearts Helper

An [Alt1](https://github.com/skillbert/alt1) plugin that helps with the collection of strange and golden rocks for the
Shattered Hearts D&D.

## How to use

1. Launch the plugin and then open your _Statue collection bag_ so that the plugin can read from the screen. Once the
   plugin UI matches what you have in each of your _Statue collection bag_ tabs, you are ready to start collecting
   rocks!
2. The UI is updated every time you find a strange or golden rock, and the most recently gained rock of each type is
   highlighted with a cyan glow. (You should avoid going for two of the same type in a row, as there is a 50% reduced
   chance of getting the second strange or golden rock of the same skill.)

## Screenshots

![Screenshot-Golden-Rock-and-UI.png](doc%2FScreenshot-Golden-Rock-and-UI.png)

## Development

### Build

```shell
npm ci
npm run build # or npm run watch
```

Open `dist/index.html` in your browser or the Alt1 browser and add the app to Alt1.

### Automated testing

There are some Jest unit tests which you can run with `npm run test`.

There is also a very simple but very useful test in `tests/index.ts` which feeds the plugin a sequence of game
screenshots and verifies that the plugin state is what it should be after each. In order to run this test, you should
execute `npm run build-test` and then open `dist/index.html` in your browser and check the console for errors. I would
like to migrate this to use Jest instead.

## Licence

See [LICENSE.md](LICENSE.md)
