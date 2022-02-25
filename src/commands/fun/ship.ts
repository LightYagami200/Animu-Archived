// =====================
// SECTION | IMPORTS
// =====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';
import { mulberry32 } from '@utils';
import { ship } from '@assets/json/fun.json';
// =====================!SECTION

// =====================
// SECTION | COMMAND
// =====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ship')
    .setDescription('Ship 2 degenerate souls')
    .addUserOption((option) =>
      option
        .setName('soul-1')
        .setDescription('Degenerate soul 1')
        .setRequired(true),
    )
    .addUserOption((option) =>
      option
        .setName('soul-2')
        .setDescription('Degenerate soul 2')
        .setRequired(false),
    ),
  async execute(interaction: CommandInteraction) {
    // -> Get soul2
    const soul1 = interaction.options.getMember('soul-1')! as GuildMember;
    const soul2 = (interaction.options.getMember('soul-2') ||
      interaction.member)! as GuildMember;

    // -> If both souls are the same
    if (soul1.id === soul2.id)
      return await interaction.reply({
        content: `I've seen many desperate soulds before - but no one as desperate as you`,
      });

    // -> If soul1 is Animu
    if (
      soul1.id === interaction.client.user!.id ||
      soul2.id === interaction.client.user!.id
    )
      return await interaction.reply({
        content: `☠️ No one's worthy of being shipped with me (◡‿◡✿) - **-̵̮̊1̸̰͎͗̄%̶̗̚**`,
      });

    // -> Generate ship %
    const shipPercent = Math.floor(
      mulberry32(parseInt(soul1.id) + parseInt(soul2.id)) * 100,
    );

    // -> Reply
    await interaction.reply({
      content: `${soul1} ${shipPercent < 50 ? '💔' : '💖'} ${soul2}\n${
        shipPercent <= 10
          ? ship['<=10']
          : shipPercent <= 30
          ? ship['<=30']
          : shipPercent <= 50
          ? ship['<=50']
          : shipPercent === 69
          ? ship['===69']
          : shipPercent <= 70
          ? ship['<=70']
          : shipPercent <= 80
          ? ship['<=80']
          : shipPercent <= 99
          ? ship['<=99']
          : ship['===100']
      } - **${shipPercent}%**`,
    });
  },
};
// =====================!SECTION
