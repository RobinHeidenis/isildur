export interface TestRunnerOptions {
    config: string;
    bail: boolean;
    diff: boolean;
    allowNoTests: boolean;
    testNameFilter: string;
    timeout: number;
    maxWorkers: number;
} // These are all the options Mocha and Jest have in common

export type PartialTestRunnerOptions = Partial<TestRunnerOptions>;

export interface IsildurTestRunner {
    run(options?: PartialTestRunnerOptions): Promise<TestSuite[]>;
    discover(options?: PartialTestRunnerOptions): Promise<BaseTestSuite[]>;
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