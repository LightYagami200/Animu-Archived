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
    .setName('stats')
    .setDescription('View bot stats - Animu Team only :)'),
  async execute(interaction: CommandInteraction) {
    const guildCount = interaction.client.guilds.cache.size;

    return await interaction.reply({
      embeds: [
        new MessageEmbed({
          title: 'Stats',
          fields: [
            {
              name: 'Guilds',
              value: `${guildCount}`,
              inline: true,
            },
          ],
        }),
      ],
      ephemeral: true,
    });
  },
};
// =====================!SECTION
