// ====================
// SECTION | IMPORTS
// ====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { kill } from '@assets/json/action-gifs.json';
import _ from 'lodash';
// ====================!SECTION

// ====================
// SECTION | COMMAND
// ====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('kill')
    .setDescription('kill someone')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to kill')
        .setRequired(true),
    ),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      content: `${interaction.options.getMember('user') as GuildMember}`,
      embeds: [
        new MessageEmbed({
          title: `${
            (interaction.member as GuildMember).displayName
          } killed ${
            (interaction.options.getMember('user') as GuildMember)
              .displayName
          }`,
          image: {
            url: _.sample(kill),
          },
        }),
      ],
      components: [],
    });
  },
};
// ====================!SECTION
