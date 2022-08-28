module.exports = {
    name: 'volume',
    aliases: ['v', 'set', 'set-volume'],
    inVoiceChannel: true,
    run: async (client, message, args) => {
      const queue = client.distube.getQueue(message)
      if (!queue) return message.channel.send(`${client.emotes.error} | NADA PRA TOCAR`)
      const volume = parseInt(args[0])
      if (isNaN(volume)) return message.channel.send(`${client.emotes.error} | Precisa ser um número`)
      queue.setVolume(volume)
      message.channel.send(`${client.emotes.success} | Volume mudado para \`${volume}\``)
    }
  }