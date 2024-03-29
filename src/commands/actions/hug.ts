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
import { hug } from '@assets/json/action-gifs.json';
import { sample } from 'lodash';
import { confirm } from '@utils';
// =====================!SECTION

// =====================
// SECTION | COMMAND
// =====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('hug')
    .setDescription('Hug someone')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to hug')
        .setRequired(true),
    ),
  async execute(interaction: CommandInteraction) {
    if (
      (interaction.options.getMember('user') as GuildMember).id ===
      (interaction.member as GuildMember).id
    )
      return interaction.reply({
        content: "You can't hug yourself",
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
        } to hug you?`,
        (interaction.options.getMember('user') as GuildMember).id,
        60 * 1000,
      );

      await ir.update({
        content: `${interaction.options.getMember('user')}`,
        embeds: [
          new MessageEmbed({
            title: `${
              (interaction.member as GuildMember).displayName
            } hugged ${
              (interaction.options.getMember('user') as GuildMember)
                .displayName
            }`,
            image: {
              url: sample(hug),
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
        } denied hug by ${
          (interaction.member as GuildMember).displayName
        }`,
        components: [],
      });
    }
  },
};
// =====================!SECTION
