import {
  Context,
  context,
  logging,
  PersistentMap,
  PersistentVector,
  storage,
  u128,
} from 'near-sdk-as';



import { Date } from "as-wasi";
import { AccountId, Job, JobId } from './models';

const ERR_INVALID_ACCOUNT = 'Invalid account';
const ERR_INVALID_AMOUNT = 'Invalid amount';
const ERR_INVALID_TIME = 'Invalid time';
const ERR_INVALID_JOBS = 'Invalid job id';
const ERR_CANNOT_ACCEPT = 'Cannot accept jobs';
const ERR_INVAID_OPERATION = 'Invalid operation on the jobId';

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

const jobList = new PersistentMap<JobId,AccountId >('jl');



const appliedList = new PersistentMap<JobId, PersistentVector<AccountId>>('ajl');

//added to get list of jobs per company
const accountList = new PersistentMap<AccountId, PersistentVector<JobId>>('cl');

const inProgressList = new PersistentMap<JobId, AccountId>('ipjl');


 //utility; search for jobs
export function getJobs(jobId: JobId): Job {
  assert(jobs.contains(jobId), ERR_INVALID_JOBS);
  return jobs.getSome(jobId);
}

//utility : search for jobs under an account
export function getJobsForAccount(account: AccountId): u64[] {
  assert(balances.contains(account), ERR_INVALID_ACCOUNT);
  return userJobs.get(account, [])!;
}

//step 5 -->export function EvaluateJob(){}
export function acceptJobs(jobId: JobId): void {
  assert(jobs.contains(jobId), ERR_INVALID_JOBS);
  assert(balances.contains(context.predecessor), ERR_INVALID_ACCOUNT);
  
  //cannot accept because due date has lapsed
  const job = jobs.getSome(jobId);
  assert(job.due > context.blockTimestamp,
    ERR_CANNOT_ACCEPT
  );
}
  //step 1-->create a new Job!
  //need to pass UTC timestamp format to the function while calling it
export function createJob(
  name: String,
  description: String,
  complete: Boolean,
  proof: String,
  value: u128,
  due: u64
): void {
  assert(value > u128.Zero, ERR_INVALID_AMOUNT);
  assert(due > context.blockTimestamp, ERR_INVALID_TIME);
  const account= ' ';
  const job = new Job(jobId(), name, description,account , complete, proof, value, due);

  logging.log('Creating job ' + job.id.toString());
  jobList.set(job.id,context.sender);
  let jobPerAccount = new PersistentVector<JobId>('c');
  if(accountList.contains(context.sender)){
    jobPerAccount=accountList.getSome(context.sender);
  }
  jobPerAccount.push(job.id);
  accountList.set(context.sender,jobPerAccount);
  jobs.set(job.id, job);
  const userJobsList = userJobs.get(context.predecessor, [])!;
  userJobsList.push(job.id);
  userJobs.set(context.predecessor, userJobsList);
}

//step2--> contractor sends proposals
export function sendProposal(jobId:u64): void{
  let contractorList = new PersistentVector<AccountId>('c');
  if(appliedList.contains(jobId)){
    contractorList=appliedList.getSome(jobId);
  }
  contractorList.push(Context.sender);
  appliedList.set(jobId,contractorList);
}

//TODO: get proposal for given job id for -- only corresponding company can check
//export function getProposal(){}

//step3 --> Company issues work order
export function acceptProposal(
  jobId:u64,
  contractorId:string
):void{
  assert(jobList.getSome(jobId)==context.sender,ERR_INVAID_OPERATION);
  inProgressList.set(jobId,contractorId);
  appliedList.delete(jobId);
}
//step 4 --> contractor finishes and logs the task
export function JobCompleted():void {

}


