// Dependencies
import { Document, Model } from 'mongoose';

// Interface
export interface ICommandsUsage {
  /** Name of Command */
  commandName: string;
  /** Total number of times it's been used */
  totalUses: number;
}

// Exports
export interface ICommandsUsageDocument extends ICommandsUsage, Document {}

export interface ICommandsUsageModel
  extends Model<ICommandsUsageDocument> {
  logCommandsUsage(this: ICommandsUsageModel, commandName: string): void;
}
