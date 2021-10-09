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
import { bonk} from '@assets/json/action-gifs.json';
import _ from 'lodash';
import confirm from '@utils/confirm';
// ====================!SECTION

// ====================
// SECTION | COMMAND
// ====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('bonk')
    .setDescription('bonk someone')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to bonk')
        .setRequired(true),
    ),
  async execute(interaction: CommandInteraction) {
      await interaction.reply({
        embeds: [
          new MessageEmbed({
            title: `${
              (interaction.member as GuildMember).displayName
            } bonked ${
              (interaction.options.getMember('user') as GuildMember)
                .displayName
            }`,
            image: {
              url: _.sample(bonk),
            },
          }),
        ],
        components: [],
      });
  },
};
// ====================!SECTION
