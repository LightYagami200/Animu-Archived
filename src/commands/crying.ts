// ====================
// SECTION | IMPORTS
// ====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { crying } from '@assets/json/reaction-gifs.json';
import _ from 'lodash';
// ====================!SECTION

// ====================
// SECTION | COMMAND
// ====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('crying')
    .setDescription('Crying :)'),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      embeds: [
        new MessageEmbed({
          title: `${
            (interaction.member! as GuildMember).displayName
          } is Crying`,
          image: {
            url: _.sample(crying),
          },
        }),
      ],
    });
  },
};
// ====================!SECTION
