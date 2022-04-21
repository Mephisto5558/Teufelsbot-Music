const express = require("express");
const app = express();

module.exports = (client) => {

  websiteMessages = ['Hello World!', 'Lena is kuhl', 'Flo is kuhl', 'huhu', 'What are you doing here?', 'https://www.youtube.com/watch?v=xvFZjo5PgG0']
  websiteMessage = websiteMessages[Math.floor(Math.random() * websiteMessages.length)]
  
  app.listen(1000, () => { console.log("Website is online") });
  app.get("*", (_, res) => { res.send(websiteMessage) });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  
  app.post('/restart', (req, res) => {
    if (req.body.token != process.env.WebCommandKey) return res.sendStatus(403);
    res.send(true);
    console.log("Restart initiated from web server");
    process.exit(0)
  });

  app.post('/ping', (req, res) => {
    if (req.body.token != process.env.WebCommandKey) return res.sendStatus(403);
    console.log("Ping initiated from web server");
    data = client.functions.ping;
    res.send(data);
  });
  
}