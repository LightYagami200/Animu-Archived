const keys =
  process.env.NODE_ENV === 'production'
    ? require('./prod')
    : require('./dev');

const expressAppSecret: string = keys.expressAppSecret;
const discordBotToken: string = keys.discordBotToken;
const discordClientID: string = keys.discordClientID;
const discordClientSecret: string = keys.discordClientSecret;
const discordRedirectURL: string = keys.discordRedirectURL;

export {
  expressAppSecret,
  discordBotToken,
  discordClientID,
  discordClientSecret,
  discordRedirectURL,
};
