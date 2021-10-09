// ====================
// SECTION | IMPORTS
// ====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { shoot } from '@assets/json/action-gifs.json';
import _ from 'lodash';
// ====================!SECTION

// ====================
// SECTION | COMMAND
// ====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('shoot')
    .setDescription('Shoot someone')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to shoot')
        .setRequired(true),
    ),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      embeds: [
        new MessageEmbed({
          title: `${
            (interaction.member as GuildMember).displayName
          } shot ${
            (interaction.options.getMember('user') as GuildMember)
              .displayName
          }`,
          image: {
            url: _.sample(shoot),
          },
        }),
      ],
      components: [],
    });
  },
};
// ====================!SECTION
