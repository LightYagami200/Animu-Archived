const keys =
  process.env.NODE_ENV === 'production'
    ? require('./prod')
    : require('./dev');

const discordBotToken: string = keys.discordBotToken;
const discordClientID: string = keys.discordClientID;
const discordTestGuildID: string = keys.discordTestGuildID;
const mongoConnectionString: string = keys.mongoConnectionString;
const topGGToken: string = keys.topGGToken;
const teamMembers: string[] = keys.teamMembers
  .split(',')
  .map((s: string) => s.trim());

export {
  discordBotToken,
  discordClientID,
  discordTestGuildID,
  mongoConnectionString,
  topGGToken,
  teamMembers,
};
