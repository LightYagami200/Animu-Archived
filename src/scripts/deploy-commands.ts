// ====================
// SECTION | IMPORTS
// ====================
import 'module-alias/register';
import { REST } from '@discordjs/rest';
import {
  discordBotToken,
  discordClientID,
  discordTestGuildID,
} from '@keys';
import { Routes } from 'discord-api-types/v9';
import { readdirSync } from 'fs';
import { join } from 'path';
// ====================!SECTION

// ====================
// SECTION | COMMANDS
// ====================
const commands: unknown[] = [];

const commandFiles = readdirSync(join(__dirname, '..', 'commands')).filter(
  (file) => file.endsWith('.js'),
);

for (const file of commandFiles) {
  const command = require(`../commands/${file}`);

  commands.push(command.data);
}

const rest = new REST({ version: '9' }).setToken(discordBotToken);

rest
  .put(
    // @ts-ignore
    Routes.applicationGuildCommands(discordClientID, discordTestGuildID),
    { body: commands },
  )
  .then(() => console.log('REGISTERED COMMANDS'))
  .catch(console.error);
// ====================!SECTION
