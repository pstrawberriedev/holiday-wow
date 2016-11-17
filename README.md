# Holiday WoW!
An exploration of the battle.net WoW API to pull & display character information. /src/ contains Node server, /dist/ is the compiled version.

## Careful
This project is front-end only (API key exposed).

### Requirements for Use
- A Browser

### Requirements for further exploration
- Node JS

### Instructions
- Grab an API key from the Battle.net API site [https://dev.battle.net/](https://dev.battle.net/)
- Rename the file in */dist/wow_config/* to key.js (or /src/public/wow_config/ if you're using node)
- Put your API key in the now-renamed key.js
- Open up wow.html and everything should work

### Notes
- This is only a basic character lookup (basic info, items, item level)
- Sometimes the Bnet API returns an empty character. See [http://us.battle.net/forums/en/bnet/topic/20749835280](http://us.battle.net/forums/en/bnet/topic/20749835280)
- Have a gud day ^_^