// =====================
// SECTION | IMPORTS
// =====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
// =====================!SECTION

// =====================
// SECTION | COMMAND
// =====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription("Animu Chan's here to help you out :D"),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      embeds: [
        new MessageEmbed({
          title: 'Animu - A tiny lil bundle of happiness',
          description:
            "Here's the list of all the awesome commands you can use!",
          fields: [
            {
              name: 'Reactions',
              value:
                '`/cry`, `/evil`, `/happy`, `/idea`, `/love-eye`, `/panic`, `/sad`, `/scared`, `/scream`, `/sleepy`, `/smile`, `/smirk`, `think`',
            },
            {
              name: 'Actions',
              value:
                '`/bonk`, `/headbutt`, `/hug`, `/kick`, `kill`, `/kiss`, `/pat`, `/punch`, `/shoot`, `/slap`, `/slash`, `/smack`, `/stab`',
            },
            {
              name: 'Randomness',
              value: '`/flip-coin`. `/choose`',
            },
          ],
          color: 0x2196f3,
        }),
      ],
      ephemeral: true,
    });
  },
};
// =====================!SECTION
