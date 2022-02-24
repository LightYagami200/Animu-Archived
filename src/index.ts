// =====================
// SECTION | IMPORTS
// =====================
import 'module-alias/register';
import { Client, Collection, Intents } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { connect, connection } from 'mongoose';
import { discordBotToken, mongoConnectionString } from '@keys';
import { logCommandUsage } from '@utils';
// =====================!SECTION

// =====================
// SECTION | CLIENT
// =====================
// -> Read command folders
const commandFolders = readdirSync(join(__dirname, 'commands'));

const eventFiles = readdirSync(join(__dirname, 'events')).filter((file) =>
  file.endsWith('.js'),
);

const client = new Client({
  presence: {
    activities: [
      {
        name: 'Anime',
        type: 'WATCHING',
      },
    ],
  },
  intents: [Intents.FLAGS.GUILDS],
});

const commandsCollection: Collection<string, any> = new Collection();

// -> Read command files
for (const folder of commandFolders) {
  const commandFiles = readdirSync(
    join(__dirname, 'commands', folder),
  ).filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(join(__dirname, 'commands', folder, file));
    commandsCollection.set(command.data.name, command);
  }
}
// =====================!SECTION

// =====================
// SECTION | MAIN
// =====================
// -> Connect with DB
connect(mongoConnectionString);

// -> When connected to MongoDB
connection.once('open', async () => {
  console.log('Database Status: Online');
});

// -> Handle Events
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// -> Handle Commands
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand() && !interaction.isContextMenu()) return;

  const { commandName } = interaction;

  logCommandUsage(commandName);

  if (!commandsCollection.has(commandName)) return;

  try {
    await commandsCollection.get(commandName).execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "Oops! Command couldn't be executed for magical reasons",
      ephemeral: true,
    });
  }
});
// =====================!SECTION

// =====================
// SECTION | LOGIN
// =====================
try {
  client.login(discordBotToken);
  console.log('Bot Status: Online');
} catch (error) {
  console.error(error);
}
// =====================!SECTION
