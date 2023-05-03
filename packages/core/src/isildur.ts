import type { TestSuite } from '@isildur-testing/api';
import { JestRunner } from '@isildur-testing/jest';
import { CoreIsildurClass, TestRunner } from '~/interface';

export class Isildur implements CoreIsildurClass {
    constructor(public runner: TestRunner) {}

    async runAllTests(): Promise<TestSuite[]> {
        if (this.runner === 'jest') {
            const runner = new JestRunner();
            return runner.runAllTests();
        }

        else return [];
    }
}
