import type { TestSuite } from '@isildur-testing/api';
import { JestRunner } from '@isildur-testing/jest';
import { MochaRunner } from '@isildur-testing/mocha';
import { CoreIsildurClass, TestRunner } from '~/interface';

export class Isildur implements CoreIsildurClass {
    constructor(public runner: TestRunner) {}

    async runAllTests(): Promise<TestSuite[]> {
        if (this.runner === 'jest') {
            const runner = new JestRunner();
            return runner.runAllTests();
        }
        else if (this.runner === 'mocha') {
            const runner = new MochaRunner();
            return runner.runAllTests();
        }
        throw new Error(`Unknown test runner: ${this.runner}`);
    }
}
