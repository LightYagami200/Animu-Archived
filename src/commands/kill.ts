// =====================
// SECTION | IMPORTS
// =====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { kill } from '@assets/json/action-gifs.json';
import { sample } from 'lodash';
// =====================!SECTION

// =====================
// SECTION | COMMAND
// =====================
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
    if (
      (interaction.options.getMember('user') as GuildMember).id ===
      (interaction.member as GuildMember).id
    )
      return interaction.reply({
        content: "You can't kill yourself",
        ephemeral: true,
      });

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
            url: sample(kill),
          },
        }),
      ],
      components: [],
    });
  },
};
// =====================!SECTION
