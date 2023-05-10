import type { BaseTestSuite, TestSuite } from '@isildur-testing/api';
import { JestRunner } from '@isildur-testing/jest';
import { MochaRunner } from '@isildur-testing/mocha';
import { CoreIsildurClass, TestRunner } from '~/interface';

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

    async runAllTests(): Promise<TestSuite[]> {
        return this.testRunner.runAllTests();
    }

    async discoverAllTests(): Promise<BaseTestSuite[]> {
        return this.testRunner.discoverAllTests();
    }
}
