const keys =
  process.env.NODE_ENV === 'production'
    ? require('./prod')
    : require('./dev');

const discordBotToken: string = keys.discordBotToken;
const discordClientID: string = keys.discordClientID;
const discordTestGuildID: string = keys.discordTestGuildID;

export { discordBotToken, discordClientID, discordTestGuildID };
