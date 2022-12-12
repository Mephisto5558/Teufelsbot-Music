const { Collection } = require('discord.js');

async function reloadCommand({ name, category, filePath }, reloadedArray) {
  delete require.cache[filePath];
  const file = require(filePath);

  if (file.disabled) return;
  file.filePath = filePath;
  file.category = category;

  this.slashCommands.set(name, file);
  reloadedArray.push(`/${name}`);

  for (const alias of file.aliases?.slash || []) {
    this.slashCommands.set(alias, { ...file, aliasOf: file.name });
    reloadedArray.push(`/${alias}`);
  }
}

module.exports = {
  name: 'reload',
  dmPermission: true,
  options: [{
    name: 'command',
    type: 'String',
    autocomplete: true,
    autocompleteOptions: function () { return [...new Set(this.client.slashCommands.keys())]; },
    required: true
  }],

  run: async function (lang) {
    const commandArray = new Collection([...this.client.slashCommands]);
    let reloadedArray = [];

    if (this.options.getString('command') == '*') {
      for (const [, command] of commandArray)
        await reloadCommand.call(this.client, command, reloadedArray);
    }
    else {
      const command = commandArray.get(this.options.getString('command'));
      if (!command) return this.reply(lang('invalidCommand'));

      await reloadCommand.call(this.client, command, reloadedArray);
    }

    const commands = reloadedArray.join('`, `');
    return this.editReply(lang(!reloadedArray.length ? 'noneReloaded' : 'reloaded', { count: reloadedArray.length, commands: commands.length < 800 ? commands : commands.substring(0, commands.substring(0, 800).lastIndexOf('`,') + 1) + '...' }));
  }
};