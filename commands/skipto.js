module.exports = {
    name: 'skipto',
    inVoiceChannel: true,
    run: async (client, message, args) => {
      const queue = client.distube.getQueue(message)
      if (!queue) return message.channel.send(`${client.emotes.error} | NADA PRA TOCAR`)
      if (!args[0]) {
        return message.channel.send(`${client.emotes.error} | Por favor informe o tempo para pular`)
      }
      const num = Number(args[0])
      if (isNaN(num)) return message.channel.send(`${client.emotes.error} | Precisa ser um número`)
      await client.distube.jump(message, num).then(song => {
        message.channel.send({ content: `pulado para: ${song.name}` })
      })
    }
  }