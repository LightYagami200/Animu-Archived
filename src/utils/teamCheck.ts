// =====================
// SECTION | IMPORTS
// =====================
import { teamMembers } from '@keys';
import { CommandInteraction } from 'discord.js';
// =====================!SECTION

// =====================
// SECTION | Team Check
// =====================
async function teamCheck(
  interaction: CommandInteraction,
  required: boolean = true,
) {
  if (!teamMembers.includes(interaction.user.id)) {
    if (required)
      await interaction.reply({
        content: 'This command is only available to Animu Team members!',
        ephemeral: true,
      });

    return false;
  }

  return true;
}

export default teamCheck;
// =====================!SECTION
