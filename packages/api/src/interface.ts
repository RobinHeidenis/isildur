export interface TestRunnerOptions {
    config: string;
}

export interface IsildurTestRunner {
    run(options?: TestRunnerOptions): Promise<TestSuite[]>;
    discover(options?: TestRunnerOptions): Promise<BaseTestSuite[]>;
}

export type TestResultStatus = 'passed' | 'failed' | 'skipped';

export interface BaseTestSuite {
    name: string;
    file: string;
    suites: BaseTestSuite[];
    tests: Omit<TestResult, 'status'>[];
}

export interface TestSuite extends BaseTestSuite {
    duration: number;
    suites: TestSuite[];
    tests: TestResult[];
}

export interface BaseTestResult {
    name: string;
    status: TestResultStatus;
    file: string;
}

export interface PassingTestResult extends BaseTestResult {
    status: 'passed';
    duration: number;
}

export interface FailingTestResult extends BaseTestResult {
    status: 'failed';
    error: string;
    duration: number;
}

export interface SkippedTestResult extends BaseTestResult {
    status: 'skipped';
    duration: number;
}

export type TestResult = PassingTestResult | FailingTestResult | SkippedTestResult;