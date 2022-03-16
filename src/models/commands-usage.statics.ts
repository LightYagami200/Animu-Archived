// Dependencies
import { ICommandsUsageModel } from './commands-usage.types';

// Statics
export async function logCommandsUsage(
  this: ICommandsUsageModel,
  commandName: string,
) {
  console.log('Log', { commandName });

  await this.findOneAndUpdate(
    { commandName },
    { commandName, $inc: { totalUses: 1 } },
    { upsert: true, new: true },
  );
}
