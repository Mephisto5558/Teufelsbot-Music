const
  fs = require('fs'),
  date = new Date().toLocaleDateString('en').replace(/\//g, '-'),
  startCount = parseInt(fs.readFileSync('./Logs/startCount.log') || 0) + 1,
  getTime = _ => new Date().toLocaleTimeString('en', { timeStyle: 'medium', hour12: false }),
  writeLogFile = (type, data) => fs.appendFileSync(`./Logs/${date}_${type}.log`, `[${getTime()}] ${data}\n`);

fs.writeFileSync('./Logs/startCount.log', startCount.toString());

module.exports = function logHandler() {
  this.log = (...data) => {
    console.info(`[${getTime()}] ${data}`);
    writeLogFile('log', data);
  };

  this.error = (...data) => {
    console.error(errorColor, `[${getTime()}] ${data}`);
    writeLogFile('log', data);
    writeLogFile('error', data);
  };

  this
    .on('debug', debug => {
      if (debug.includes('Sending a heartbeat.') || debug.includes('Heartbeat acknowledged'))
        return;
      if (debug.includes('Provided token:'))
        debug = 'Provided token: (CENSORED)';

      writeLogFile('debug', debug);

      if (debug.includes('Hit a 429')) {
        if (!this.isReady()) {
          this.error(errorColor, 'Hit a 429 while trying to login. Restarting shell.');
          process.kill(1);
        }
        else
          this.error(errorColor, 'Hit a 429 while trying to execute a request');
      }
    })
    .on('warn', warn => writeLogFile('warn', warn))
    .on('error', error => writeLogFile('error', error));
}