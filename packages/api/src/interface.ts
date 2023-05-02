export interface Isildur {
    runner: 'jest' | 'mocha';

    runAllTests(): TestResult[];
}

interface BaseTestResult {
    name: string;
    status: 'pass' | 'fail';
    file: string;
    duration: number;
}

interface PassingTestResult extends BaseTestResult {
    status: 'pass';
}

interface FailingTestResult extends BaseTestResult {
    status: 'fail';
    error: string;
}

export type TestResult = PassingTestResult | FailingTestResult;