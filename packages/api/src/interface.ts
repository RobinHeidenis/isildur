export interface IsildurTestRunner {
    runAllTests(): Promise<TestSuite[]>;
    discoverAllTests(): Promise<BaseTestSuite[]>;
}

export type TestResultStatus = 'pass' | 'fail' | 'skipped';

export interface BaseTestSuite {
    name: string;
    file: string;
    suites: TestSuite[];
    tests: Omit<TestResult, 'status'>[];
}

export interface TestSuite extends BaseTestSuite {
    duration: number;
    numFailing: number;
    numPassing: number;
    numSkipped: number;
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