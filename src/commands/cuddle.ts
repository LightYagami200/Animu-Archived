// =====================
// SECTION | IMPORTS
// =====================
import { SlashCommandBuilder } from '@discordjs/builders';
import {
  ButtonInteraction,
  CommandInteraction,
  GuildMember,
  MessageEmbed,
} from 'discord.js';
import { cuddle } from '@assets/json/action-gifs.json';
import confirm from '@utils/confirm';
import { sample } from 'lodash';
// =====================!SECTION

// =====================
// SECTION | COMMAND
// =====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('cuddle')
    .setDescription('Cuddle someone')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to cuddle')
        .setRequired(true),
    ),
  async execute(interaction: CommandInteraction) {
    if (
      (interaction.options.getMember('user') as GuildMember).id ===
      (interaction.member as GuildMember).id
    )
      return interaction.reply({
        content: "You can't cuddle yourself",
        ephemeral: true,
      });

    await interaction.deferReply();

    try {
      const ir = await confirm(
        interaction,
        `${
          interaction.options.getMember('user') as GuildMember
        }, Would you like to allow ${
          (interaction.member as GuildMember).displayName
        } to cuddle you?`,
        (interaction.options.getMember('user') as GuildMember).id,
        60 * 1000,
      );

      await ir.update({
        content: '',
        embeds: [
          new MessageEmbed({
            title: `${
              (interaction.member as GuildMember).displayName
            } cuddled ${
              (interaction.options.getMember('user') as GuildMember)
                .displayName
            }`,
            image: {
              url: sample(cuddle),
            },
          }),
        ],
        components: [],
      });
    } catch (e) {
      await (e as ButtonInteraction).update({
        content: `Oof! ${
          (interaction.options.getMember('user') as GuildMember)
            .displayName
        } denied cuddle by ${
          (interaction.member as GuildMember).displayName
        }`,
        components: [],
      });
    }
  },
};
// =====================!SECTION
