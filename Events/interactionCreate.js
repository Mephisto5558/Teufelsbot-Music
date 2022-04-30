const client = require("..");

client.on('interactionCreate', async interaction => {
  const args = [];
  let userSleepTime;
  let globalSleepTime;
  let isOnCooldown = false;
  const command = client.commands.get(interaction.commandName);
  if(!command) return;

  if(client.cooldown.get(interaction.member.id)?.indexOf(command.name) > -1) isOnCooldown = true;
  else if(client.cooldown.get('global')?.indexOf(command.name) > -1) isOnCooldown = true;
  if(isOnCooldown) {
      //return interaction.reply({ content: 'This command is on cooldown!', ephemeral: true });
  };

  if(client.cooldown.get(interaction.member.id)) {
    client.cooldown.set(interaction.member.id, [...client.cooldown.get(interaction.member.id), command.name]);
  } else client.cooldown.set(interaction.member.id, [command.name]);


  if(interaction.isCommand()) {
    if(command.category != 'Information') await interaction.deferReply();

    for(let option of interaction.options.data) {
      if(option.type === "SUB_COMMAND") {
        if(option.name) args.push(option.name);
        option.options?.forEach(x => {
          if(x.value) args.push(x.value);
        });
      } else if(option.value) args.push(option.value);
    }

    if(!interaction.member.permissions.has(command.userPermissions && ['SEND_MESSAGES'])) {
      return interaction.followUp(`You don't have ${command.userPermissions} or SEND_MESSAGES permission to run this command..`);
    }

    let filter = !interaction.member.voice.channel && command.category != 'Information' && interaction.commandName != 'leave'
    if(filter) return interaction.followUp(`You need to join a voice channel first!`);
    client.interaction = interaction;
    command.run(client, client.interaction, args);
  }

  if(interaction.isContextMenu()) {
    client.interaction = interaction;
    command.run(client, client.interaction, args);
  }


  if(!command.cooldown.user || command.cooldown.user === 'default') {
    command.cooldown.user = 200
  };

  if(command.cooldown.global > command.cooldown.user) {
    userSleepTime = false
  };

  if(!command.cooldown.global || command.cooldown.global === 'default') {
    globalSleepTime = false
  } else globalSleepTime = command.cooldown.global;

  if(userSleepTime) {
    setTimeout(_ => {
      const array = client.cooldown.get(interaction.member.id);
      const index = array.indexOf(command.name);
      if(index > -1) {
        array.splice(index, 1);
        client.cooldown.set(interaction.member.id, array);
      }
    }, userSleepTime)
  };

  if(globalSleepTime) {
    setTimeout(_ => {
      const array = client.cooldown.get('global');
      const index = array.indexOf(command.name);
      if(index > -1) {
        array.splice(index, 1);
        client.cooldown.set('global', array);
      }
    }, globalSleepTime)
  }

})