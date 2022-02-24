// =====================
// SECTION | IMPORTS
// =====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed, Options } from 'discord.js';
import { sample } from 'lodash';
// =====================!SECTION

// =====================
// SECTION | COMMAND
// =====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('choose')
    .setDescription(
      'Choose between provided options - Separate options with a comma :)',
    )
    .addStringOption((option) =>
      option
        .setName('options')
        .setDescription('Options to choose from')
        .setRequired(true),
    ),
  async execute(interaction: CommandInteraction) {
    // -> Select a random option
    const option = sample(
      interaction.options.getString('options')!.split(','),
    );

    await interaction.reply({
      embeds: [
        new MessageEmbed({
          title: `I choose **${option}**!`,
          description: 'Choosing a random option',
        }),
      ],
    });
  },
};
// =====================!SECTION
