// =====================
// SECTION | IMPORTS
// =====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { mulberry32 } from '@utils';
import { CommandInteraction, GuildMember } from 'discord.js';
import { coolness } from '@assets/json/fun.json';
// =====================!SECTION

// =====================
// SECTION | COMMAND
// =====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('coolness')
    .setDescription(
      'None of you can ever reach my level of coolness (◡‿◡✿)',
    )
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to analyze coolness of')
        .setRequired(false),
    ),
  async execute(interaction: CommandInteraction) {
    // -> Get member
    const member = (interaction.options.getMember('user') ||
      interaction.member)! as GuildMember;

    // -> If member is Animu
    if (member.id === interaction.client.user!.id)
      return await interaction.reply(
        "I'm more cool than you can possibly imagine (◡‿◡✿)",
      );

    // -> Generate iq comment
    const coolnessComment = `${coolness[
      Math.floor(mulberry32(parseInt(member.id)) * (coolness.length - 1))
    ].replace('$USER', `${member}`)}`;

    // -> Reply
    await interaction.reply({
      content: coolnessComment,
    });
  },
};
// =====================!SECTION
