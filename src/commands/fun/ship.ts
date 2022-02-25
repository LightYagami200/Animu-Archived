// =====================
// SECTION | IMPORTS
// =====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { mulberry32 } from '@utils';
import { CommandInteraction, GuildMember } from 'discord.js';
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
    const ship = Math.floor(
      mulberry32(parseInt(soul1.id) + parseInt(soul2.id)) * 100,
    );

    // -> Reply
    await interaction.reply({
      content: `${soul1} ${ship < 50 ? '💔' : '💖'} ${soul2}\n${
        ship <= 10
          ? '🌊 This ship sunk before it even had a chance to leave shallow waters'
          : ship <= 30
          ? '🧊 Iceberg up ahead'
          : ship <= 50
          ? '🦇 Story of this ship is almost as bad as twilight'
          : ship === 69
          ? '💘 Nice'
          : ship <= 70
          ? '🛶 This ship is barely floating'
          : ship <= 80
          ? '🛥️ This ship might have some future'
          : ship <= 99
          ? '🚢 This ship is on a roll'
          : '🏝️ As pewdiepie once said, NOW FRICK!'
      } - **${ship}%**`,
    });
  },
};
// =====================!SECTION
