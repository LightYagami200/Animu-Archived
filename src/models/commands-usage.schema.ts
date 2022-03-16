// Dependencies
import { Schema } from 'mongoose';
import {
  ICommandsUsageDocument,
  ICommandsUsageModel,
} from '@models/commands-usage.types';
import { logCommandsUsage } from './commands-usage.statics';

// Schema
const CommandsUsageSchema = new Schema<
  ICommandsUsageDocument,
  ICommandsUsageModel
>({
  commandName: {
    type: String,
    unique: true,
  },
  totalUses: Number,
});

// Statics
CommandsUsageSchema.statics.logCommandsUsage = logCommandsUsage;

// Methods

// Exports
export default CommandsUsageSchema;
