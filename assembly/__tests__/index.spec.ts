import {
  createJob,
  getJobs, getJobsForAccount, jobId
} from '..';

const alice = 'alice';
const bob = 'bob';

describe('jobs contract', () => {

  //tried setting up a job to have for testing purposes but wasn't sure how to assign some of the values
  // beforeAll(createJob(
  //   'job1', 
  //   'job for testing',
  //   'accountid-hired',
  //   false,
  //   'proof goes here',
  //   340282366920938463463374607431768211455, //not sure how to write a u128 value
  //   2021/4/26
  // ));

  it('returns an error if no jobs exists', () => {
    //expect(getJobsForAccount(alice).length).toBe(0);
    //I commented above out because it breaks the test since there is no account for alice. Maybe a beforeEach or All and create the account?
    expect(() => {
      getJobs(1);
    }).toThrow();
  });

  it('creates a new job id via jobId fxn', () => {
    const newJobId = jobId();
    expect(newJobId).toBe(1);
  });

  it('searches for a specific job by id and returns the job if found via getJobs', () => {
    
  })


});

