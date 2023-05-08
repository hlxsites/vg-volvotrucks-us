import { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';

class MyReporter implements Reporter {
  private testResults: { [key: string]: TestResult } = {};
  private testCases: { [key: string]: TestCase } = {};

  onBegin(config: FullConfig, suite: Suite) {
    console.log(`Starting the run with ${suite.allTests().length} tests`);
  }

  onTestBegin(test: TestCase, result: TestResult) {
    console.log(`Starting test ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    console.log(`Finished test ${test.title}: ${result.status}`);
    this.testResults[test.id] = result;
    this.testCases[test.id] = test;
  }

  onEnd(result: FullResult) {
    console.log(`Finished the run: ${result.status}`);
    const failures = Object.entries(this.testResults)
      .filter(([id, result] )=> result.status !== 'passed');

    if(failures.length > 0) {
      console.log(`There were ${failures.length} failures:`);
    }
    for (const [id, result] of failures) {
      const test: TestCase = this.testCases[id];
      if(result.status === 'passed') continue;
      console.log(`${test.title} - ${result.error.message}`);
    }
  }
}

export default MyReporter;
