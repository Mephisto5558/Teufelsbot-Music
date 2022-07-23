module.exports = async client => {
  client.user.setActivity({ name: '/help', type: 'PLAYING' });

  client.log('Ready to receive prefix commands');
}