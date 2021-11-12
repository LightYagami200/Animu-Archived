const keys =
  process.env.NODE_ENV === 'production'
    ? require('./prod')
    : require('./dev');

const discordBotToken: string = keys.discordBotToken;
const discordClientID: string = keys.discordClientID;
const discordTestGuildID: string = keys.discordTestGuildID;
const mongoConnectionString: string = keys.mongoConnectionString;

export {
  discordBotToken,
  discordClientID,
  discordTestGuildID,
  mongoConnectionString,
};
