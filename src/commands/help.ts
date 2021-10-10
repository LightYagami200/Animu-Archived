// ====================
// SECTION | IMPORTS
// ====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
// ====================!SECTION

// ====================
// SECTION | COMMAND
// ====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription("Animu Chan's here to help you out :D"),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      embeds: [
        new MessageEmbed({
          title: 'Animu - A tiny lil bundle of happiness',
          description: "Type `/` and you'll get list of possible commands",
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
          ],
          color: 0x2196f3,
        }),
      ],
      ephemeral: true,
    });
  },
};
// ====================!SECTION
