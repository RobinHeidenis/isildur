export interface IsildurTestRunner {
    runAllTests(): TestResult[];
}

export type TestResultStatus = 'pass' | 'fail';

interface BaseTestResult {
    name: string;
    status: TestResultStatus;
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