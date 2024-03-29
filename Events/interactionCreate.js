const
  { EmbedBuilder, Colors, InteractionType, ApplicationCommandOptionType, ComponentType, PermissionFlagsBits } = require('discord.js'),
  ownerOnlyFolders = require('../config.json')?.ownerOnlyFolders?.map(e => e?.toLowerCase()) || ['owner-only'],
  { I18nProvider, cooldowns, permissionTranslator, errorHandler, buttonPressHandler } = require('../Utils');

async function componentHandler(lang) {
  switch (this.componentType) {
    // case ComponentType.Button: return buttonPressHandler.call(this, lang);
  }
}

module.exports = async function interactionCreate() {
  if (this.client.settings.blacklist?.includes(this.user.id)) return;
  if (this.type == InteractionType.MessageComponent) return componentHandler.call(this, I18nProvider.__.bBind(I18nProvider, { locale: this.guild.localeCode }));

  const command = this.client.slashCommands.get(this.commandName);

  //DO NOT REMOVE THIS STATEMENT!
  if (!command || (ownerOnlyFolders.includes(command.category.toLowerCase()) && this.user.id != this.client.application.owner.id)) return;

  const lang = I18nProvider.__.bBind(I18nProvider, { locale: this.guild.localeCode, backupPath: `commands.${command.category.toLowerCase()}.${command.name}` });
  const disabledList = this.guild.db.commandSettings?.[command.aliasOf || command.name]?.disabled || {};

  if (disabledList.members && disabledList.members.includes(this.user.id)) return this.reply({ content: lang('events.notAllowed.member'), ephemeral: true });
  if (disabledList.channels && disabledList.channels.includes(this.channel.id)) return this.reply({ content: lang('events.notAllowed.channel'), ephemeral: true });
  if (disabledList.roles && this.member.roles.cache.some(e => disabledList.roles.includes(e.id))) return this.reply({ content: lang('events.notAllowed.role'), ephemeral: true });

  if (this.type == InteractionType.ApplicationCommandAutocomplete) {
    const
      lang = I18nProvider.__.bBind(I18nProvider, { locale: this.guild.localeCode, backupPath: `commands.${command.category.toLowerCase()}.${command.name}`, undefinedNotFound: true }),
      response = v => ({ name: lang(`options.${this.options._group ? this.options._group + '.' : ''}${this.options._subcommand ? this.options._subcommand + '.' : ''}${this.focused.name}.choices.${v}`) ?? v, value: v });

    let { options } = command.fMerge();
    if (this.options._group) options = options.find(e => e.name == this.options._group);
    if (this.options._subcommand) options = options.find(e => e.name == this.options._subcommand).options;
    options = options.find(e => e.name == this.focused.name).autocompleteOptions;
    if (typeof options == 'function') options = await options.call(this);

    return this.respond(
      typeof options == 'string' ? [response(options)] : options
        .filter(e => e.toLowerCase().includes(this.focused.value.toLowerCase()))
        .slice(0, 25)
        .map(response)
    );
  }

  const cooldown = await cooldowns.call(this, command);
  if (cooldown) return this.reply({ content: lang('events.cooldown', cooldown), ephemeral: true });

  if (command.requireVC && !this.member.voice.channel) return this.reply({ content: lang('notInVoiceChannel'), ephemeral: true });
  if (command.requireQueue && !this.musicPlayer?.songs.length) return this.reply({ content: lang('playMusicFirst'), ephemeral: true });

  if (this.type == InteractionType.ApplicationCommand) {
    const userPermsMissing = this.member.permissionsIn(this.channel).missing(command.permissions?.user);
    const botPermsMissing = this.guild.members.me.permissionsIn(this.channel).missing([...(command.permissions?.client || []), PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks]);

    if (botPermsMissing.length || userPermsMissing.length) {
      const embed = new EmbedBuilder({
        title: lang('events.permissionDenied.embedTitle'),
        color: Colors.Red,
        description: lang(`events.permissionDenied.embedDescription${userPermsMissing.length ? 'User' : 'Bot'}`, { permissions: permissionTranslator(botPermsMissing.length ? botPermsMissing : userPermsMissing).join('`, `') })
      });

      return this.reply({ embeds: [embed], ephemeral: true });
    }

    if (!command.noDefer && !this.replied) await this.deferReply({ ephemeral: command.ephemeralDefer ?? false });

    for (const entry of this.options._hoistedOptions)
      if (entry.type == ApplicationCommandOptionType.String) entry.value = entry.value.replaceAll('<@!', '<@');


    try {
      command.run.call(this, lang)?.catch(err => errorHandler.call(this.client, err, this, lang));
      if (this.client.botType != 'dev') this.client.db.update('botSettings', `stats.${command.name}`, this.client.settings.stats?.[command.name] + 1 || 1);
    } catch (err) { errorHandler.call(this.client, err, this, lang); }
  }
};