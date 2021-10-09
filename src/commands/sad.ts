// ====================
// SECTION | IMPORTS
// ====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { sad } from '@assets/json/reaction-gifs.json';
import _ from 'lodash';
// ====================!SECTION

// ====================
// SECTION | COMMAND
// ====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('sad')
    .setDescription('Sad :)'),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      embeds: [
        new MessageEmbed({
          title: `${
            (interaction.member! as GuildMember).displayName
          } is Smiling`,
          image: {
            url: _.sample(sad),
          },
        }),
      ],
    });
  },
};
// ====================!SECTION
