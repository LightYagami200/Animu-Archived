// ====================
// SECTION | IMPORTS
// ====================
import { SlashCommandBuilder } from '@discordjs/builders';
import {
  ButtonInteraction,
  CommandInteraction,
  GuildMember,
  MessageEmbed,
} from 'discord.js';
import { kick} from '@assets/json/action-gifs.json';
import _ from 'lodash';
import confirm from '@utils/confirm';
// ====================!SECTION

// ====================
// SECTION | COMMAND
// ====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('kick someone')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to kick')
        .setRequired(true),
    ),
  async execute(interaction: CommandInteraction) {
      await interaction.reply({
        embeds: [
          new MessageEmbed({
            title: `${
              (interaction.member as GuildMember).displayName
            } kicked ${
              (interaction.options.getMember('user') as GuildMember)
                .displayName
            }`,
            image: {
              url: _.sample(kick),
            },
          }),
        ],
        components: [],
      });
  },
};
// ====================!SECTION