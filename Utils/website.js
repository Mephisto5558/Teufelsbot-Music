const
  app = require('express')(),
  gitpull = require('./gitpull.js');

app.listen(process.env.port || 8000);
app.post('/git/pull', (_, res) => {
  gitpull();
  res.sendStatus(200);
});

console.log('Website is online');