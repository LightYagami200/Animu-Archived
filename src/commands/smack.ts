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
import { smack} from '@assets/json/action-gifs.json';
import _ from 'lodash';
import confirm from '@utils/confirm';
// ====================!SECTION

// ====================
// SECTION | COMMAND
// ====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('smack')
    .setDescription('smack someone')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to smack')
        .setRequired(true),
    ),
  async execute(interaction: CommandInteraction) {
      await interaction.reply({
        embeds: [
          new MessageEmbed({
            title: `${
              (interaction.member as GuildMember).displayName
            } smacked ${
              (interaction.options.getMember('user') as GuildMember)
                .displayName
            }`,
            image: {
              url: _.sample(smack),
            },
          }),
        ],
        components: [],
      });
  },
};
// ====================!SECTION
