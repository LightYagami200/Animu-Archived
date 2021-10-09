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
          title: 'Help',
          description: '',
          color: 0x2196f3,
        }),
      ],
      ephemeral: true,
    });
  },
};
// ====================!SECTION
