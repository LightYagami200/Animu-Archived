// ====================
// SECTION | IMPORTS
// ====================
import 'module-alias/register';
import { discordBotToken } from '@keys';
import { Client, Collection, Intents } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
// ====================!SECTION

// ====================
// SECTION | CLIENT
// ====================
const commandFiles = readdirSync(join(__dirname, 'commands')).filter(
  (file) => file.endsWith('.js'),
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

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  commandsCollection.set(command.data.name, command);
}
// ====================!SECTION

// ====================
// SECTION | MAIN
// ====================
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand() && !interaction.isContextMenu()) return;

  const { commandName } = interaction;

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
// ====================!SECTION

// ====================
// SECTION | LOGIN
// ====================
try {
  client.login(discordBotToken);
} catch (error) {
  console.error(error);
}
// ====================!SECTION
