// Dependencies
import { model } from 'mongoose';
import {
  ICommandUsageDataDocument,
  ICommandUsageDataModel,
} from '@models/commands-usage.types';
import CommandsUsageSchema from '@models/commands-usage.schema';

// Export
export const CommandsUsageModel = model<
  ICommandUsageDataDocument,
  ICommandUsageDataModel
>('CommandsUsage', CommandsUsageSchema, 'commandsUsage');
