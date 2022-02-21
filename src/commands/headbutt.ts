// =====================
// SECTION | IMPORTS
// =====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { headbutt } from '@assets/json/action-gifs.json';
import _ from 'lodash';
// =====================!SECTION

// =====================
// SECTION | COMMAND
// =====================
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
    if (
      (interaction.options.getMember('user') as GuildMember).id ===
      (interaction.member as GuildMember).id
    )
      return interaction.reply({
        content: "You can't headbutt yourself",
        ephemeral: true,
      });

    await interaction.reply({
      content: `${interaction.options.getMember('user') as GuildMember}`,
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
// =====================!SECTION
