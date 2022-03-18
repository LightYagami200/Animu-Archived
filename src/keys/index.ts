const keys =
  process.env.NODE_ENV === 'production'
    ? require('./prod')
    : require('./dev');

const discordBotToken: string = keys.discordBotToken;
const discordClientID: string = keys.discordClientID;
const discordClientSecret: string = keys.discordClientSecret;
const discordRedirectURI: string = keys.discordRedirectURI;
const discordTestGuildID: string = keys.discordTestGuildID;
const encryptionSecret: string = keys.encryptionSecret;
const mongoConnectionString: string = keys.mongoConnectionString;
const topGGToken: string = keys.topGGToken;
const teamMembers: string[] = keys.teamMembers
  .split(',')
  .map((s: string) => s.trim());
const bunnyAPIKey: string = keys.bunnyAPIKey;

export {
  discordBotToken,
  discordClientID,
  discordClientSecret,
  discordRedirectURI,
  discordTestGuildID,
  encryptionSecret,
  mongoConnectionString,
  topGGToken,
  teamMembers,
  bunnyAPIKey,
};
