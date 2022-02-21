// =====================
// SECTION | IMPORTS
// =====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { bonk } from '@assets/json/action-gifs.json';
import { sample } from 'lodash';
// =====================!SECTION

// =====================
// SECTION | COMMAND
// =====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('bonk')
    .setDescription('Bonk someone')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to bonk')
        .setRequired(true),
    ),
  async execute(interaction: CommandInteraction) {
    if (
      (interaction.options.getMember('user') as GuildMember).id ===
      (interaction.member as GuildMember).id
    )
      return interaction.reply({
        content: "You can't bonk yourself",
        ephemeral: true,
      });

    await interaction.reply({
      content: `${interaction.options.getMember('user') as GuildMember}`,
      embeds: [
        new MessageEmbed({
          title: `${
            (interaction.member as GuildMember).displayName
          } bonked ${
            (interaction.options.getMember('user') as GuildMember)
              .displayName
          }`,
          image: {
            url: sample(bonk),
          },
        }),
      ],
      components: [],
    });
  },
};
// =====================!SECTION
