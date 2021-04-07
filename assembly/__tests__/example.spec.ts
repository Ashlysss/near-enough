import {
  getJobs, getJobsForAccount
} from '..';

const alice = 'alice';
const bob = 'bob';

describe('jobs contract', () => {
  it('returns an error if no jobs exists', () => {
    //expect(getJobsForAccount(alice).length).toBe(0);
    expect(() => {
      getJobs(1);
    }).toThrow();
  });

});

