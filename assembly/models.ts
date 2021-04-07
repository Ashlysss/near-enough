import { u128 } from 'near-sdk-as';

export type AccountId = string;
export type JobId = u64;

@nearBindgen
export class Job {
  constructor(
    public id: JobId,
    public name: String,
    public description: String,
    public hire: AccountId,
    public complete: Boolean,
    public proof: String,
    public value: u128,
    public due: u64
  ) { }
}