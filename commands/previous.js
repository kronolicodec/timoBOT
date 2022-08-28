module.exports = {
    name: 'previous',
    inVoiceChannel: true,
    run: async (client, message) => {
      const queue = client.distube.getQueue(message)
      if (!queue) return message.channel.send(`${client.emotes.error} | NADA PRA TOCAR`)
      const song = queue.previous()
      message.channel.send(`${client.emotes.success} | tocando agora:\n${song.name}`)
    }
  }