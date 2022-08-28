module.exports = {
    name: 'pause',
    aliases: ['pause', 'hold'],
    inVoiceChannel: true,
    run: async (client, message) => {
      const queue = client.distube.getQueue(message)
      if (!queue) return message.channel.send(`${client.emotes.error} | NADA PRA TOCAR`)
      if (queue.paused) {
        queue.resume()
        return message.channel.send('CONTINUANDO...')
      }
      queue.pause()
      message.channel.send('PAUSADO')
    }
  }