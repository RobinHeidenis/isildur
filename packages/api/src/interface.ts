export interface IsildurTestRunner {
    runAllTests(): Promise<TestSuite[]>;
}

export type TestResultStatus = 'pass' | 'fail' | 'skipped';

export interface TestSuite{
    name: string;
    file: string;
    duration: number;
    numFailing: number;
    numPassing: number;
    numSkipped: number;
    numTodo: number;
    tests: TestResult[];
}

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

interface SkippedTestResult extends BaseTestResult {
    status: 'skipped';
}

export type TestResult = PassingTestResult | FailingTestResult | SkippedTestResult;