const client = require('../index');
const Distube = require('distube').default;
const { YtDlpPlugin } = require("@distube/yt-dlp")
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");

let player = new Distube(client, {
  emitNewSongOnly: false,
  leaveOnEmpty: false,
  leaveOnFinish: false,
  leaveOnStop: false,
  youtubeDL: false,
  savePreviousSongs: true,
  searchSongs: 5,
  searchCooldown: 30,
  plugins: [ new YtDlpPlugin(), new SpotifyPlugin(), new SoundCloudPlugin() ],
});

module.exports = player;