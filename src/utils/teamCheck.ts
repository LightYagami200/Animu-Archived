// =====================
// SECTION | IMPORTS
// =====================
import { teamMembers } from '@keys';
import { CommandInteraction } from 'discord.js';
// =====================!SECTION

// =====================
// SECTION | Team Check
// =====================
function teamCheck(interaction: CommandInteraction) {
  if (!teamMembers.includes(interaction.user.id)) {
    return interaction.reply({
      content: 'This command is only available to Animu Team members!',
      ephemeral: true,
    });
  }
}

export default teamCheck;
// =====================!SECTION
