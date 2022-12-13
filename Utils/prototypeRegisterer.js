const
  { CommandInteraction, BaseClient, Collection, Status, AutocompleteInteraction, User, Guild } = require('discord.js'),
  { randomInt } = require('crypto'),
  { appendFileSync, readdirSync } = require('fs'),
  sendEmbed = require('./sendEmbed.js'),
  date = new Date().toLocaleDateString('en').replaceAll('/', '-'),
  getTime = () => new Date().toLocaleTimeString('en', { timeStyle: 'medium', hour12: false }),
  writeLogFile = (type, ...data) => appendFileSync(`./Logs/${date}_${type}.log`, `[${getTime()}] ${data.join(' ')}\n`);

console.warn('Overwriting the following variables and functions (if they exist):\n  Vanilla:    global.getDirectoriesSync, global.sleep, Array#random, Number#limit, Object#fMerge, Object#filterEmpty, Function#bBind\n  Discord.js: BaseClient#slashCommands, BaseClient#cooldowns, BaseClient#awaitReady, BaseClient#log, BaseClient#error, BaseClient#settings, AutocompleteInteraction#focused, User#db, Guild#db, Guild#defaultSettings, Guild#localeCode, GuildMember#db.');

global.getDirectoriesSync = path => readdirSync(path, { withFileTypes: true }).filter(e => e.isDirectory()).map(directory => directory.name);
global.sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

Array.prototype.random = function random() { return this[randomInt(this.length)]; };
Number.prototype.limit = function limit({ min = -Infinity, max = Infinity } = {}) { return Math.min(Math.max(Number(this), min), max); };
Number.prototype.toFormattedTime = function () {
  if (!Number.isInteger(parseInt(this))) throw new TypeError(`${this} is not a valid number!`);
  if (this >= 86400) throw new RangeError(`Number cannot be bigger then 86400, got ${this}!`);
  return new Date(0, 0, 0, 0, 0, this).toTimeString().substring(0, 8);
};
Number.prototype.toFormattedTime = function () {
  const date = new Date(0, 0, 0, 0, 0, this);
  const [h, m, s] = [date.getHours(), date.getMinutes(), date.getSeconds()];
  return h == 0 ? `${m}:${s}` : `${h}:${m}:${s}`;
};
Object.prototype.fMerge = function fMerge(obj, mode, { ...output } = { ...this }) {
  if (`${{}}` != this || `${{}}` != obj) return output;
  for (const key of Object.keys({ ...this, ...obj })) {
    if (`${{}}` == this[key]) output[key] = key in obj ? this[key].fMerge(obj[key], mode) : this[key];
    else if (Array.isArray(this[key])) {
      if (key in obj) {
        if (mode == 'overwrite') output[key] = obj[key];
        else if (mode == 'push') for (const e of obj[key]) output[key].push(e);
        else for (let i = 0; i < this[key].length || i < obj[key].length; i++) output[key][i] = i in obj[key] ? obj[key][i] : this[key][i];
      }
      else output[key] = this[key];
    }
    else output = { ...output, [key]: key in obj ? obj[key] : this[key] };
  }
  return output;
};
Object.prototype.filterEmpty = function filterEmpty() { return Object.fromEntries(Object.entries(this).filter(([, v]) => !(v == null || (Object(v) === v && Object.keys(v).length == 0))).map(([k, v]) => [k, v instanceof Object ? v.filterEmpty() : v])); };
Function.prototype.bBind = function bBind(thisArg, ...args) {
  const bound = this.bind(thisArg, ...args);
  bound.__targetFunction__ = this;
  bound.__boundThis__ = thisArg;
  bound.__boundArgs__ = args;
  return bound;
};
Object.defineProperties(BaseClient.prototype, {
  slashCommands: { value: new Collection() },
  cooldowns: { value: new Collection() },
  awaitReady: {
    value: async function awaitReady() {
      while (this.ws.status != Status.Ready) await sleep(10);
      return this.application.name ? this.application : this.application.fetch();
    }
  },
  log: {
    value: function log(...data) {
      console.info(`[${getTime()}] ${data.join(' ')}`);
      writeLogFile('log', ...data);
      return this;
    }
  },
  error: {
    value: function log(...data) {
      console.error('\x1b[1;31m%s\x1b[0m', `[${getTime()}] ${data.join(' ')}`);
      writeLogFile('log', ...data);
      writeLogFile('error', ...data);
      return this;
    }
  },
  settings: {
    get() { return this.db?.get('botSettings') ?? {}; },
    set(val) { this.db.set('botSettings', val); }
  }
});
Object.defineProperties(CommandInteraction.prototype, {
  sendEmbed: { value: sendEmbed },
  musicPlayer: { get() { return this.client.distube?.getQueue(this.guild.id); } }
});
Object.defineProperty(AutocompleteInteraction.prototype, 'focused', {
  get() { return this.options.getFocused(true); },
  set(val) { this.options.data.find(e => e.focused).value = val; }
});
Object.defineProperty(User.prototype, 'db', {
  get() { return this.client.db?.get('userSettings')?.[this.id] ?? {}; },
  set(val) { this.client.db.set('userSettings', { [this.id]: val }); }
});
Object.defineProperties(Guild.prototype, {
  musicPlayer: { get() { return this.client.musicPlayer?.getQueue(this.id) ?? {}; } },
  db: {
    get() { return this.client.db?.get('guildSettings')?.[this.id] ?? {}; },
    set(val) { this.client.db.set('guildSettings', { [this.id]: val }); }
  },
  defaultSettings: {
    get() { return this.client.db?.get('guildSettings')?.default ?? {}; },
    set(val) { this.client.db.set('guildSettings', { default: val }); }
  },
  localeCode: {
    get() { return this.db.config?.lang || this.preferredLocale.slice(0, 2) || this.defaultSettings.config.lang; },
    set(val) { this.client.db.update('guildSettings', 'config.lang', val); }
  }
});