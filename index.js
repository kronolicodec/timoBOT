const { DisTube } = require('distube')
const Discord = require('discord.js')
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildVoiceStates,
    Discord.GatewayIntentBits.MessageContent
  ]
})
const fs = require('fs')
const config = require('./config.json')
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')
const { Channel } = require('diagnostics_channel')

client.config = require('./config.json')
client.distube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin({
      emitEventsAfterFetching: true
    }),
    new SoundCloudPlugin(),
    new YtDlpPlugin()
  ]
})
client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.emotes = config.emoji

fs.readdir('./commands/', (err, files) => {
  if (err) return console.log('SEM COMANDOS')
  const jsFiles = files.filter(f => f.split('.').pop() === 'js')
  if (jsFiles.length <= 0) return console.log('SEM COMMANDOS')
  jsFiles.forEach(file => {
    const cmd = require(`./commands/${file}`)
    console.log(`Loaded ${file}`)
    client.commands.set(cmd.name, cmd)
    if (cmd.aliases) cmd.aliases.forEach(alias => client.aliases.set(alias, cmd.name))
  })
})

client.on('ready', () => {
  console.log(`${client.user.tag} is ready to play music.`)
  client.user.setPresence({
    activities: [{ name: `DVD Skylab IX 5- Eu chupo o meu pau`, type: ActivityType.Listening }],
    status: 'dnd',
  });
})

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return
  const prefix = config.prefix
  if (!message.content.startsWith(prefix)) return
  const args = message.content.slice(prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
  if (!cmd) return
  if (cmd.inVoiceChannel && !message.member.voice.channel) {
    return message.channel.send(`${client.emotes.error} | Você precisa estar em um canal 🐒`)
  }
  try {
    cmd.run(client, message, args)
  } catch (e) {
    console.error(e)
    message.channel.send(`${client.emotes.error} | Error: \`${e}\``)
  }
})

const status = queue =>
  `Volume: \`${queue.volume}%\` | Filtro: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${
    queue.repeatMode ? (queue.repeatMode === 2 ? 'FIla' : 'Esta música') : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
client.distube
  .on('playSong', (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.play} | Tocando \`${song.name}\` - \`${song.formattedDuration}\`\Procurado por: ${
        song.user
      }\n${status(queue)}`
    )
  )
  .on('addSong', (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.success} | adicionado ${song.name} - \`${song.formattedDuration}\` a fila por ${song.user}`
    )
  )
  .on('addList', (queue, playlist) =>
    queue.textChannel.send(
      `${client.emotes.success} | adicionado  \`${playlist.name}\` playlist (${
        playlist.songs.length
      } songs) a fila \n${status(queue)}`
    )
  )
  .on('error', (channel, e) => {
    if (channel) channel.send(`${client.emotes.error} | Ocorreu um erro: ${e.toString().slice(0, 1974)}`)
    else console.error(e)
  })
  .on('empty',channel => {
      return channel.send("sozinho no setor....")
  })
  .on('searchNoResult', (message, query) =>
    message.channel.send(`${client.emotes.error} | nenhum resultado \`${query}\`!`)
  )
  .on('finish', queue => queue.textChannel.send('terminado!'))



client.login(config.token)