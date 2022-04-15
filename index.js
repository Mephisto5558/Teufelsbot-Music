console.log("Starting...")

const { Client, Collection } = require("discord.js");
const fs = require("fs");

const express = require("express");
const app = express();

const client = new Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: 32767
});

module.exports = client;

client.prefix = '.';
client.userID = '948978571802710047';
client.owner = '691550551825055775';
client.events = new Collection();
client.cooldowns = new Collection();
client.commands = new Collection();
client.categories = fs.readdirSync("./Commands/");
client.slashCommandList = [];

fs.readdirSync("./Handlers").filter((file) => file.endsWith("_handler.js")).forEach((handler) => {
  require(`./Handlers/${handler}`)(client);
});

client.login(process.env.token)
  .then(console.log("Logged in"));

app.listen(1000, () => { console.log("Website is online") })
app.get("/", (req, res) => { res.send('Hello world!') })

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.get('/restart', (req, res) => { res.send('Hello world!') });
app.post('/restart', (req, res) => {
  if (req.body.token != process.env.WebCommandKey) return res.sendStatus(403)
  res.send(true);
  console.log("Restart initiated from web server");
  process.exit(0)
});

client.sleep = function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

process.on('exit', async () => {
  await client.interaction.reply('.')
    .then(client.interaction.deleteReply());
  client.destroy();
});
