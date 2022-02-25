// =====================
// SECTION | IMPORTS
// =====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';
import { splitmix32 } from '@utils';
import { iq } from '@assets/json/fun.json';
// =====================!SECTION

// =====================
// SECTION | COMMAND
// =====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('iq')
    .setDescription('Big brain or smol brain?')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to view IQ of')
        .setRequired(false),
    ),
  async execute(interaction: CommandInteraction) {
    // -> member
    const member = (interaction.options.getMember('user') ||
      interaction.member)! as GuildMember;

    // -> If member is Animu
    if (member.id === interaction.client.user!.id)
      return await interaction.reply({
        content: `My IQ is over 9000! ╰(◡‿◡✿╰)`,
      });

    // -> Generate iq
    const iqPoints = Math.floor(
      splitmix32(parseInt(member.id)) * (200 - 40) + 40,
    );

    // -> Reply
    await interaction.reply({
      content: `${(iqPoints <= 50
        ? iq['<=50']
        : iqPoints <= 69
        ? iq['===69']
        : iqPoints <= 70
        ? iq['<=70']
        : iqPoints <= 90
        ? iq['<=90']
        : iqPoints <= 100
        ? iq['<=100']
        : iqPoints <= 110
        ? iq['<=110']
        : iqPoints <= 120
        ? iq['<=120']
        : iqPoints <= 130
        ? iq['<=130']
        : iqPoints <= 140
        ? iq['<=140']
        : iqPoints <= 160
        ? iq['<=160']
        : iqPoints === 169
        ? iq['===169']
        : iqPoints <= 180
        ? iq['<=180']
        : iqPoints <= 199
        ? iq['<=199']
        : iq['===200']
      ).replace('$USER', `${member}`)} - **${iqPoints} IQ**`,
    });
  },
};
// =====================!SECTION
