// =====================
// SECTION | IMPORTS
// =====================
import { CommandsUsageModel } from '@models/commands-usage.model';
// =====================!SECTION

// =====================
// SECTION | LOG USAGE
// =====================
function logCommandsUsage(commandName: string) {
  CommandsUsageModel.logCommandsUsage(commandName);
}

export default logCommandsUsage;
// =====================!SECTION
