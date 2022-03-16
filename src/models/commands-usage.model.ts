// Dependencies
import { model } from 'mongoose';
import {
  ICommandsUsageDocument,
  ICommandsUsageModel,
} from '@models/commands-usage.types';
import CommandsUsageSchema from '@models/commands-usage.schema';

// Export
export const CommandsUsageModel = model<
  ICommandsUsageDocument,
  ICommandsUsageModel
>('CommandsUsage', CommandsUsageSchema, 'commandsUsage');
