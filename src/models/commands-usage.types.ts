// Dependencies
import { Document, Model } from 'mongoose';

// Interface
export interface ICommandUsageData {
  commandName: string;
  totalUses: number;
}

// Exports
export interface ICommandUsageDataDocument
  extends ICommandUsageData,
    Document {}

export interface ICommandUsageDataModel
  extends Model<ICommandUsageDataDocument> {
  logCommandUsage(this: ICommandUsageDataModel, commandName: string): void;
}
