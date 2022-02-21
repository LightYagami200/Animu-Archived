// =====================
// SECTION | IMPORTS
// =====================
import { CommandsUsageModel } from '@models/commands-usage.model';
// =====================!SECTION

// =====================
// SECTION | LOG USAGE
// =====================
function logCommandUsage(commandName: string) {
  CommandsUsageModel.logCommandUsage(commandName);
}

export default logCommandUsage;
// =====================!SECTION
