// =====================
// SECTION | IMPORTS
// =====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import teamCheck from 'utils/teamCheck';
// =====================!SECTION

// =====================
// SECTION | COMMAND
// =====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('View bot stats - Animu Team only :)'),
  async execute(interaction: CommandInteraction) {
    const hasAccess = await teamCheck(interaction);

    if (!hasAccess) return;

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
