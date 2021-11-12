// Dependencies
import { ICommandUsageDataModel } from './commands-usage.types';

// Statics
export async function logCommandUsage(
  this: ICommandUsageDataModel,
  commandName: string,
) {
  console.log('Log', { commandName });

  await this.findOneAndUpdate(
    { commandName },
    { commandName, $inc: { totalUses: 1 } },
    { upsert: true, new: true },
  );
}
