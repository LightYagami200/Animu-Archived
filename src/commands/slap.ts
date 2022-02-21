// =====================
// SECTION | IMPORTS
// =====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { slap } from '@assets/json/action-gifs.json';
import _ from 'lodash';
// =====================!SECTION

// =====================
// SECTION | COMMAND
// =====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('slap')
    .setDescription('Slap someone')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to slap')
        .setRequired(true),
    ),
  async execute(interaction: CommandInteraction) {
    if (
      (interaction.options.getMember('user') as GuildMember).id ===
      (interaction.member as GuildMember).id
    )
      return interaction.reply({
        content: "You can't slap yourself",
        ephemeral: true,
      });

    await interaction.reply({
      content: `${interaction.options.getMember('user') as GuildMember}`,
      embeds: [
        new MessageEmbed({
          title: `${
            (interaction.member as GuildMember).displayName
          } slapped ${
            (interaction.options.getMember('user') as GuildMember)
              .displayName
          }`,
          image: {
            url: _.sample(slap),
          },
        }),
      ],
      components: [],
    });
  },
};
// =====================!SECTION
