import { IsildurTestRunner } from "@isildur-testing/api";

export type TestRunner = 'jest' | 'mocha';

export interface CoreIsildurClass extends IsildurTestRunner {
    runner: TestRunner;
}