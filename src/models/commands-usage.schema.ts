// Dependencies
import { Schema } from 'mongoose';
import {
  ICommandUsageDataDocument,
  ICommandUsageDataModel,
} from '@models/commands-usage.types';
import { logCommandUsage } from './commands-usage.statics';

// Schema
const CommandsUsageSchema = new Schema<
  ICommandUsageDataDocument,
  ICommandUsageDataModel
>({
  commandName: {
    type: String,
    unique: true,
  },
  totalUses: Number,
});

// Statics
CommandsUsageSchema.statics.logCommandUsage = logCommandUsage;

// Methods

// Exports
export default CommandsUsageSchema;
