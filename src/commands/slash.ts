// ====================
// SECTION | IMPORTS
// ====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { slash } from '@assets/json/action-gifs.json';
import _ from 'lodash';
// ====================!SECTION

// ====================
// SECTION | COMMAND
// ====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('slash')
    .setDescription('Slash someone')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to slash')
        .setRequired(true),
    ),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      embeds: [
        new MessageEmbed({
          title: `${
            (interaction.member as GuildMember).displayName
          } slashed ${
            (interaction.options.getMember('user') as GuildMember)
              .displayName
          }`,
          image: {
            url: _.sample(slash),
          },
        }),
      ],
      components: [],
    });
  },
};
// ====================!SECTION
