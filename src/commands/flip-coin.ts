// =====================
// SECTION | IMPORTS
// =====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
// =====================!SECTION

// =====================
// SECTION | COMMAND
// =====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('flip-coin')
    .setDescription('Flip a coin!'),
  async execute(interaction: CommandInteraction) {
    const side = Math.random() < 0.5 ? 'heads' : 'tails';

    await interaction.reply({
      embeds: [
        new MessageEmbed({
          title: `It's **${side}**!`,
          description: 'Flipping a coin',
        }),
      ],
    });
  },
};
// =====================!SECTION
