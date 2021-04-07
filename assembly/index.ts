import {
  context,
  logging,
  PersistentMap,
  storage,
  u128,
} from 'near-sdk-as';
import { AccountId, Job, JobId } from './models';

const ERR_INVALID_ACCOUNT = 'Invalid account';
const ERR_INVALID_AMOUNT = 'Invalid amount';
const ERR_INVALID_TIME = 'Invalid time';
const ERR_INVALID_JOBS = 'Invalid job id';
const ERR_CANNOT_ACCEPT = 'Cannot accept jobs';

//setup jobId
export function jobId(): JobId {
  const w = storage.getPrimitive<u64>('jobId', 1);
  storage.set<u64>('jobId', w + 1);
  return w;
}

//setup balance of account
const balances = new PersistentMap<AccountId, u128>('b');
 //setup map of jobs
const jobs = new PersistentMap<JobId, Job>('w');
 //setup index of jobs for user
const userJobs = new PersistentMap<AccountId, u64[]>('u');

 //search for jobs
export function getJobs(jobId: JobId): Job {
  assert(jobs.contains(jobId), ERR_INVALID_JOBS);
  return jobs.getSome(jobId);
}

//search for jobs under an account
export function getJobsForAccount(account: AccountId): u64[] {
  assert(balances.contains(account), ERR_INVALID_ACCOUNT);
  return userJobs.get(account, [])!;
}

 //accept job
export function acceptJobs(jobId: JobId): void {
  assert(jobs.contains(jobId), ERR_INVALID_JOBS);
  assert(balances.contains(context.predecessor), ERR_INVALID_ACCOUNT);
  
  //cannot accept because due date has lapsed
  const job = jobs.getSome(jobId);
  assert(job.due > context.blockTimestamp,
    ERR_CANNOT_ACCEPT
  );
}
  //create a new Job!
export function createJob(
  name: String,
  description: String,
  hire: AccountId,
  complete: Boolean,
  proof: String,
  value: u128,
  due: Date
): void {
  assert(value > u128.Zero, ERR_INVALID_AMOUNT);
  assert(due > context.blockTimestamp, ERR_INVALID_TIME);

  const job = new Job(jobId(), name, description, hire, complete, proof, value, due);

  logging.log('Creating job ' + job.id.toString());

  jobs.set(job.id, job);
  const userJobsList = userJobs.get(context.predecessor, [])!;
  userJobsList.push(job.id);
  userJobs.set(context.predecessor, userJobsList);
}