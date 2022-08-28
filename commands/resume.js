module.exports = {
    name: 'resume',
    aliases: ['resume', 'unpause'],
    inVoiceChannel: true,
    run: async (client, message) => {
      const queue = client.distube.getQueue(message)
      if (!queue) return message.channel.send(`${client.emotes.error} | NADA PRA TOCAR`)
      if (queue.paused) {
        queue.resume()
        message.channel.send('CONTINUANDO')
      } else {
        message.channel.send('tem que estar pausado')
      }
    }
  }