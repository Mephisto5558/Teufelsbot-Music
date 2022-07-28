const app = require('express')();
const { exec } = require('child_process');

const pull = _ => exec('git pull', { maxBuffer: 1024 * 600 }, (err, stdout, stderr) => {
  if (err) console.error(`GIT PULL\nexec error: ${err}`);
  console.log(
    'GIT PULL\n',
    `out: ${stdout || 'none'}`,
    `err: ${stderr || 'none'}\n`
  );
});

pull();

app.listen(process.env.port || 8080);
app.get('*', (_, res) => res.sendStatus(200));
app.post('/github/hooks/pull', (_, res) => {
  res.sendStatus(200);
  pull();
});

console.log('Website is online')
console.log('Git auto pull is running');