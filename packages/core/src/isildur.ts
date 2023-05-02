import type { IsildurClass, TestResult, TestRunner } from '@isildur-testing/api';

export class Isildur implements IsildurClass {
    runner: TestRunner;

    constructor(runner: TestRunner) {
        this.runner = runner;
    }

    runAllTests(): TestResult[] {
        return [];
    }
}
