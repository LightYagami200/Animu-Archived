// ====================
// SECTION | IMPORTS
// ====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { headbutt } from '@assets/json/action-gifs.json';
import _ from 'lodash';
// ====================!SECTION

// ====================
// SECTION | COMMAND
// ====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('headbutt')
    .setDescription('Headbutt someone')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to headbutt')
        .setRequired(true),
    ),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      embeds: [
        new MessageEmbed({
          title: `${
            (interaction.member as GuildMember).displayName
          } headbutted ${
            (interaction.options.getMember('user') as GuildMember)
              .displayName
          }`,
          image: {
            url: _.sample(headbutt),
          },
        }),
      ],
      components: [],
    });
  },
};
// ====================!SECTION
