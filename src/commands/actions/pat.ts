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
import { pat } from '@assets/json/action-gifs.json';
import { sample } from 'lodash';
import { confirm } from '@utils';
// =====================!SECTION

// =====================
// SECTION | COMMAND
// =====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('pat')
    .setDescription('Headpat someone')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to pat')
        .setRequired(true),
    ),
  async execute(interaction: CommandInteraction) {
    if (
      (interaction.options.getMember('user') as GuildMember).id ===
      (interaction.member as GuildMember).id
    )
      return interaction.reply({
        content: "You can't pat yourself",
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
        } to pat you?`,
        (interaction.options.getMember('user') as GuildMember).id,
        60 * 1000,
      );

      await ir.update({
        content: '',
        embeds: [
          new MessageEmbed({
            title: `${
              (interaction.member as GuildMember).displayName
            } headpatted ${
              (interaction.options.getMember('user') as GuildMember)
                .displayName
            }`,
            image: {
              url: sample(pat),
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
        } denied headpat by ${
          (interaction.member as GuildMember).displayName
        }`,
        components: [],
      });
    }
  },
};
// =====================!SECTION
