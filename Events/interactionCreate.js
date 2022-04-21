const client = require("..");
client.on('interactionCreate', async interaction => {
  const args = [];
  
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    if (command.category != 'Information') await interaction.deferReply();

    for (let option of interaction.options.data) {
      if (option.type === "SUB_COMMAND") {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
         });
      }
      else if (option.value) args.push(option.value);
    }
    
    interaction.member = interaction.guild.members.cache.get(interaction.user.id);
  
    if (!interaction.member.permissions.has(command.userPermissions && ['SEND_MESSAGES'])) {
      return interaction.followUp(`You don't have ${command.userPermissions} or SEND_MESSAGES permission to run this command..`);
    }
    
    let member = interaction.guild.members.cache.get(interaction.member.id);
    let filter = !member.voice.channel && command.category != 'Information' && interaction.commandName != 'leave'
    if (filter) return interaction.followUp(`You need to join a voice channel first!`);
    client.interaction = interaction;
    command.run(client, client.interaction, args);
  }

  if (interaction.isContextMenu()) {
    const command = client.commands.get(interaction.commandName);
    client.interaction = interaction;
    if (command) command.run(client, client.interaction, args);
  }
})