import { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import { writeFileSync } from 'fs';

class MyReporter implements Reporter {
  private testResults: { [key: string]: TestResult } = {};
  private testCases: { [key: string]: TestCase } = {};
  private _outputFile: string | undefined;

  constructor(options: { outputFile?: string } = {}) {
    this._outputFile = options.outputFile;
  }

  onTestEnd(test: TestCase, result: TestResult) {
    this.testResults[test.id] = result;
    this.testCases[test.id] = test;
  }

  onEnd(result: FullResult) {
    const failures = Object.entries(this.testResults)
      .filter(([id, result] )=> result.status !== 'passed');

    let summary = ''
    if(failures.length > 0) {
      summary += `There were ${failures.length} failures:\n`;
      for (const [id, result] of failures) {
        const test: TestCase = this.testCases[id];
        if(result.status === 'passed') continue;
        summary += `${test.title} - ${result.error.message}\n`;
      }
    } else {
      summary += 'All tests passed!\n';
    }

    if(this._outputFile) {
          writeFileSync(this._outputFile, summary);
    } else {
      console.log(summary);
    }
  }
}

export default MyReporter;
