import type { BaseTestSuite, TestSuite } from '@isildur-testing/api';
import { PartialTestRunnerOptions } from '@isildur-testing/api';
import { JestRunner } from '@isildur-testing/jest';
import { MochaRunner } from '@isildur-testing/mocha';
import { CoreIsildurClass, TestRunner } from '~/interface.js';

export class Isildur implements CoreIsildurClass {
    testRunner: MochaRunner | JestRunner;
    constructor(public runner: TestRunner) {
        if (runner === 'jest') {
            this.testRunner = new JestRunner();
        } else if (runner === 'mocha') {
            this.testRunner = new MochaRunner();
        } else {
            throw new Error(`Unknown test runner: ${runner}`);
        }
    }

    async run(options?: PartialTestRunnerOptions): Promise<TestSuite[]> {
        return this.testRunner.run(options);
    }

    async discover(options?: PartialTestRunnerOptions): Promise<BaseTestSuite[]> {
        return this.testRunner.discover(options);
    }
}
