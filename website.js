const
  app = require('express')(),
  exec = require('util').promisify(require('child_process').exec);
  pull = async _ => {
    let data;

    try { data = await exec('git pull', { maxBuffer: 1024 * 600 }) }
    catch (err) { return console.error(`GIT PULL\nExec error: ${err}`) }

    console.log(
      'GIT PULL\n',
      `out: ${data.stdout?.trim() || 'none'}\n`,
      `err: ${data.stderr?.trim() || 'none'}\n`
    );
  }

console.log('Git auto pull is running');

pull();

app.listen(process.env.port || 8080);
app.post('/git/pull', (_, res) => {
  pull();
  res.sendStatus(200);
});

console.log('Website is online');