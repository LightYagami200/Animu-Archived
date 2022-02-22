// =====================
// SECTION | IMPORTS
// =====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { mulberry32 } from '@utils';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { butt } from '@assets/json/fun.json';
// =====================!SECTION

// =====================
// SECTION | COMMAND
// =====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('butt')
    .setDescription('Get my honest opinions on your butts :D')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to analyze butt of')
        .setRequired(false),
    ),
  async execute(interaction: CommandInteraction) {
    // -> Get member
    const member = (interaction.options.getMember('user') ||
      interaction.member)! as GuildMember;

    // -> If member is Animu
    if (member.id === interaction.client.user!.id)
      return await interaction.reply(
        'Baka! You dare try to check my butt? o(≧o≦)o',
      );

    // -> Generate butt comment
    const buttComment = `${butt[
      Math.floor(
        mulberry32(parseInt(member.id)) * (butt.length - 0 + 1) + 0,
      )
    ].replace('$USER', `${member}`)}`;

    // -> Reply
    await interaction.reply({
      content: `${member}`,
      embeds: [
        new MessageEmbed({
          title: `Analyzing **${member.displayName}**'s butt`,
          description: buttComment,
        }),
      ],
    });
  },
};
// =====================!SECTION
