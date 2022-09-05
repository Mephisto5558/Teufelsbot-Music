module.exports = {
  name: 'skip',
  aliases: [],
  description: 'Skips the current song',
  permissions: { client: ['EmbedLinks'], user: [] },
  cooldowns: { client: 0, user: 500 },
  category: 'Music',
  needsQueue: true,

  run: player => player.queue.skip()
}