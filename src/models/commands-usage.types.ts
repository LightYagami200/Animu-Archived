// Dependencies
import { Document, Model } from 'mongoose';

// Interface
export interface ICommandsUsage {
  commandName: string;
  totalUses: number;
}

// Exports
export interface ICommandsUsageDocument extends ICommandsUsage, Document {}

export interface ICommandsUsageModel
  extends Model<ICommandsUsageDocument> {
  logCommandsUsage(this: ICommandsUsageModel, commandName: string): void;
}
