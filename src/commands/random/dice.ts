// =====================
// SECTION | IMPORTS
// =====================
import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
// =====================!SECTION

// =====================
// SECTION | COMMAND
// =====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('roll-dice')
    .setDescription('Roll a dice')
    .addStringOption((option) =>
      option
        .setName('dice-notation')
        .setDescription('Dice notation')
        .setRequired(false),
    ),
  async execute(interaction: CommandInteraction) {
    // -> Get dice notation
    const diceNotation =
      interaction.options.getString('dice-notation') || '2d6';

    // -> Parse dice notation
    try {
      const roll = new DiceRoll(diceNotation);

      await interaction.reply({
        embeds: [
          new MessageEmbed({
            title: `Rolling ${diceNotation.toUpperCase()}`,
            description: `${roll.total}`,
          }),
        ],
      });
    } catch (e) {
      await interaction.reply({
        content:
          'Invalid dice notation, Check https://dice-roller.github.io/documentation/guide/notation/ for more info',
        ephemeral: true,
      });
    }
  },
};
// =====================!SECTION
