module.exports = async client => {
  client.user.setActivity({ name: 'music | /help', type: 'PLAYING' });
}