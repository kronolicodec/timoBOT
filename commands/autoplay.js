module.exports = {
    name: 'autoplay',
    inVoiceChannel: true,
    run: async (client, message) => {
      const queue = client.distube.getQueue(message)
      if (!queue) return message.channel.send(`${client.emotes.error} | NADA PARA TOCAR`)
      const autoplay = queue.toggleAutoplay()
      message.channel.send(`${client.emotes.success} | AutoPlay: \`${autoplay ? 'On' : 'Off'}\``)
    }
  }
  