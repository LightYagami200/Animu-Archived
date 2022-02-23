// =====================
// SECTION | IMPORTS
// =====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
// =====================!SECTION

// =====================
// SECTION | COMMAND
// =====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check if Animu is alive'),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({ ephemeral: true, content: '🏓 Pong!' });
  },
};
// =====================!SECTION
