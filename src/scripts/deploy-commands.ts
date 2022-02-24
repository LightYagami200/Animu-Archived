// =====================
// SECTION | IMPORTS
// =====================
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
// =====================!SECTION

// =====================
// SECTION | COMMANDS
// =====================
const commands: unknown[] = [];

// -> Read command folders
const commandFolders = readdirSync(join(__dirname, '..', 'commands'));

// -> Read command files
for (const folder of commandFolders) {
  const commandFiles = readdirSync(
    join(__dirname, '..', 'commands', folder),
  ).filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(join(
      __dirname,
      '..',
      'commands',
      folder,
      file,
    ));
    commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: '9' }).setToken(discordBotToken);

rest
  .put(
    process.env.NODE_ENV === 'production'
      ? Routes.applicationCommands(discordClientID)
      : Routes.applicationGuildCommands(
          discordClientID,
          discordTestGuildID,
        ),
    { body: commands },
  )
  .then(() => console.log('REGISTERED COMMANDS'))
  .catch(console.error);
// =====================!SECTION
