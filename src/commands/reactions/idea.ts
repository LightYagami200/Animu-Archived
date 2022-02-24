// =====================
// SECTION | IMPORTS
// =====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { idea } from '@assets/json/reaction-gifs.json';
import { sample } from 'lodash';
// =====================!SECTION

// =====================
// SECTION | COMMAND
// =====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('idea')
    .setDescription('Idea :)'),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      embeds: [
        new MessageEmbed({
          title: `${
            (interaction.member! as GuildMember).displayName
          } got an idea`,
          image: {
            url: sample(idea),
          },
        }),
      ],
    });
  },
};
// =====================!SECTION
