import type { TestResult } from '@isildur-testing/api';
import { CoreIsildurClass, TestRunner } from '~/interface';

export class Isildur implements CoreIsildurClass {
    runner: TestRunner;

    constructor(runner: TestRunner) {
        this.runner = runner;
    }

    runAllTests(): TestResult[] {
        return [];
    }
}
