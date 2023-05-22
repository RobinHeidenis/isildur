import type {
  BaseTestSuite,
  TestSuite as RanTestSuite,
  TestResult,
} from "@isildur-testing/api";
import { Isildur } from "@isildur-testing/core";
import path from "node:path";
import * as vscode from "vscode";
import { TestItem } from "vscode";

type TestResultWithId = Omit<TestResult, "status" | "duration"> & {
  id: string;
};

type TestSuite = Omit<BaseTestSuite, "tests" | "suites"> & {
  id: string;
  tests: TestResultWithId[];
  suites: TestSuite[];
};

const testController = vscode.tests.createTestController(
  "com.isildur.testController",
  "Isildur Test Controller"
);

if (vscode.workspace.workspaceFolders) {
  process.chdir(vscode.workspace.workspaceFolders[0]!.uri.fsPath);
}

export async function activate() {
  let workspaceRunnerSetting = vscode.workspace
    .getConfiguration("isildur")
    .get("testRunner") as string | undefined;

  workspaceRunnerSetting = workspaceRunnerSetting
    ? workspaceRunnerSetting.toLowerCase()
    : "mocha";

  const runner = new Isildur(workspaceRunnerSetting as "mocha" | "jest");

  const results = await runner.discoverAllTests();

  const resultsWithIds = generateUniqueIDs(results);

  resultsWithIds.forEach((suite) => {
    const label = getLabel(suite.file);

    if (suite.name === label) {
      const rootItem = testController.createTestItem(
        suite.id,
        label,
        getTestURI(label)
      );
      addTestsToTestItem(rootItem, suite.tests);
      addSuitesToTestItem(rootItem, suite.suites);
      testController.items.add(rootItem);
      return;
    }

    const rootItem = testController.createTestItem(
      suite.id,
      label,
      getTestURI(label)
    );
    const suiteItem = testController.createTestItem(
      suite.id,
      suite.name,
      getTestURI(label)
    );
    addTestsToTestItem(suiteItem, suite.tests);
    addSuitesToTestItem(suiteItem, suite.suites);
    rootItem.children.add(suiteItem);
    testController.items.add(rootItem);
  });
}

const addTestsToTestItem = (
  testItem: vscode.TestItem,
  tests: TestResultWithId[]
) => {
  tests.forEach((test) => {
    testItem.children.add(
      testController.createTestItem(
        test.id,
        test.name,
        getTestURI(getLabel(test.file))
      )
    );
  });
};

const addSuitesToTestItem = (
  testItem: vscode.TestItem,
  suites: TestSuite[]
) => {
  suites.forEach((suite) => {
    const suiteItem = testController.createTestItem(
      suite.id,
      suite.name,
      getTestURI(getLabel(suite.file))
    );
    addTestsToTestItem(suiteItem, suite.tests);
    addSuitesToTestItem(suiteItem, suite.suites);
    testItem.children.add(suiteItem);
  });
};

const getTestURI = (file: string) => {
  return vscode.Uri.file(
    vscode.workspace.workspaceFolders![0]!.uri.fsPath + "/" + file
  );
};

function getLabel(testPath: string) {
  const projectRoot = path.normalize(
    vscode.workspace.workspaceFolders![0]!.uri.fsPath
  );
  const suitePath = path.normalize(testPath);
  const suiteFile = suitePath.charAt(0).toLowerCase() + suitePath.slice(1);

  const label = suiteFile.startsWith(projectRoot)
    ? suiteFile.split(projectRoot)[1]
    : suiteFile;
  return label[0] === path.sep ? label.slice(path.sep.length) : label;
}

const generateUniqueIDs = (result: (BaseTestSuite | RanTestSuite)[]) => {
  const assignID = (
    item:
      | BaseTestSuite
      | RanTestSuite
      | Omit<TestResult, "status" | "duration">
      | TestResult,
    parentID: string
  ) => {
    const baseID = parentID ? parentID + "-" : "";
    const id = baseID + generateIDFromProperties(item.name, item.file);
    const suites: TestSuite[] =
      "suites" in item && item.suites
        ? item.suites.map((suite) => assignID(suite, id))
        : [];
    const tests: TestResultWithId[] =
      "tests" in item && item.tests
        ? item.tests.map((test) => assignID(test, id))
        : [];

    return { ...item, id, suites, tests };
  };

  const generateIDFromProperties = (name: string, file: string) => {
    const sanitized = name.replace(/\s+/g, "-").toLowerCase();
    return sanitized + "-" + file;
  };

  return result.map((item) => assignID(item, ""));
};

const runHandler = async (
  shouldDebug: boolean,
  request: vscode.TestRunRequest,
  token: vscode.CancellationToken
) => {
  const run = testController.createTestRun(request);

  let workspaceRunnerSetting = vscode.workspace
    .getConfiguration("isildur")
    .get("testRunner") as string | undefined;

  workspaceRunnerSetting = workspaceRunnerSetting
    ? workspaceRunnerSetting.toLowerCase()
    : "mocha";

  if (workspaceRunnerSetting === "mocha") {
    run.end();
    throw new Error("Mocha doesn't work and i don't know why");
  }

  const flatTestItems = flattenArray(testController.items);

  flatTestItems.forEach((item) => {
    run.started(item);
  });

  const runner = new Isildur(workspaceRunnerSetting as "mocha" | "jest");
  const results = await runner.discoverAllTests();
  const resultsWithIds = generateUniqueIDs(results);
  const flatResults = flattenResults(resultsWithIds);

  flatResults.forEach((result) => {
    const testItem = flatTestItems.find((item) => item.id === result.id);

    if (testItem) {
      if (Object.keys(result).includes("status")) {
        const testResult = result as unknown as TestResult;
        if (testResult.status === "pass") {
          run.passed(testItem, testResult.duration);
        } else if (testResult.status === "fail") {
          run.failed(
            testItem,
            new vscode.TestMessage(testResult.error),
            testResult.duration
          );
        } else if (testResult.status === "skipped") {
          run.skipped(testItem);
        }
      }
    }
  });

  console.log("all done");

  run.end();
};

const runProfile = testController.createRunProfile(
  "Run",
  vscode.TestRunProfileKind.Run,
  (request, token) => runHandler(false, request, token)
);

const flattenArray = (testItems: vscode.TestItemCollection) => {
  let result: TestItem[] = [];
  testItems.forEach((item) => {
    result.push(item);
    if (item.children) {
      result = result.concat(flattenArray(item.children));
    }
  });
  return result;
};

const flattenResults = (results: TestSuite[]) => {
  let result: TestResultWithId[] = [];
  results.forEach((suite) => {
    result = result.concat(suite.tests);
    if (suite.suites) {
      result = result.concat(flattenResults(suite.suites));
    }
  });
  return result;
};

export function deactivate() {}
