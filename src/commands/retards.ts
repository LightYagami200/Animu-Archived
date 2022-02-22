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
    .setName('retards')
    .setDescription('Get to know the retards who made Animu :D'),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      embeds: [
        new MessageEmbed({
          title: 'Retards',
          description:
            "Here's the list of retards who helped in the making of Animu Chan :D",
          fields: [
            {
              name: 'Retards',
              value: 'To be added',
            },
          ],
          color: 0x2196f3,
        }),
      ],
    });
  },
};
// =====================!SECTION
