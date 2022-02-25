// =====================
// SECTION | IMPORTS
// =====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { mulberry32 } from '@utils';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
// =====================!SECTION

// =====================
// SECTION | COMMAND
// =====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('pp')
    .setDescription('Your pp smol :D')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to view pp size of')
        .setRequired(false),
    ),
  async execute(interaction: CommandInteraction) {
    // -> Get member
    const member = (interaction.options.getMember('user') ||
      interaction.member)! as GuildMember;

    // -> If member is Animu
    if (member.id === interaction.client.user!.id)
      return await interaction.reply("B-baka, I don't have a pp :c");

    // -> Generate pp size
    const ppSize = `8${Array.from(
      {
        length: Math.floor(mulberry32(parseInt(member.id)) * 50),
      },
      () => '=',
    ).join('')}=>`;

    // -> Reply
    await interaction.reply({
      content: `${member}'s PP Size:\n${ppSize}`,
    });
  },
};
// =====================!SECTION
