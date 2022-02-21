// =====================
// SECTION | IMPORTS
// =====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { nom } from '@assets/json/action-gifs.json';
import _ from 'lodash';
// =====================!SECTION

// =====================
// SECTION | COMMAND
// =====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('nom')
    .setDescription('nom someone')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to nom')
        .setRequired(true),
    ),
  async execute(interaction: CommandInteraction) {
    if (
      (interaction.options.getMember('user') as GuildMember).id ===
      (interaction.member as GuildMember).id
    )
      return interaction.reply({
        content: "You can't eat yourself",
        ephemeral: true,
      });

    await interaction.reply({
      content: `${interaction.options.getMember('user') as GuildMember}`,
      embeds: [
        new MessageEmbed({
          title: `${
            (interaction.member as GuildMember).displayName
          } nomed ${
            (interaction.options.getMember('user') as GuildMember)
              .displayName
          }`,
          image: {
            url: _.sample(nom),
          },
        }),
      ],
      components: [],
    });
  },
};
// =====================!SECTION
