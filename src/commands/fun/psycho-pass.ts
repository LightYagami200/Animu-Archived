// =====================
// SECTION | IMPORTS
// =====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { mulberry32 } from '@utils';
import { CommandInteraction, GuildMember } from 'discord.js';
import { psychoPass } from '@assets/json/fun.json';
// =====================!SECTION

// =====================
// SECTION | COMMAND
// =====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('psycho-pass')
    .setDescription('Are you a threat to society? (⊙△⊙✿)')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to determine crime coefficient of')
        .setRequired(false),
    ),
  async execute(interaction: CommandInteraction) {
    // -> Get member
    const member = (interaction.options.getMember('user') ||
      interaction.member)! as GuildMember;

    // -> If member is Animu
    if (member.id === interaction.client.user!.id)
      return await interaction.reply(
        `You dare point your dominator at me? '̿'̵͇̿̿\\=(•̪●)=/̵͇̿̿/'̿̿ ̿ ̿ ̿"`,
      );

    // -> Generate psycho pass comment
    const psychopassComment = `${psychoPass[
      Math.floor(mulberry32(parseInt(member.id)) * (psychoPass.length - 1))
    ].replace('$USER', `${member}`)}`;

    // -> Reply
    await interaction.reply({
      content: psychopassComment,
    });
  },
};
// =====================!SECTION
