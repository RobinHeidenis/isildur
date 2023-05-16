import type { BaseTestSuite, TestResult } from "@isildur-testing/api";
import { Isildur } from "@isildur-testing/core";
import path from "node:path";
import * as vscode from "vscode";

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

  workspaceRunnerSetting = workspaceRunnerSetting ? workspaceRunnerSetting.toLowerCase() : "mocha";

  const runner = new Isildur(workspaceRunnerSetting as  "mocha" | "jest");

  const results = await runner.discoverAllTests();

  results.forEach((suite) => {
    const label = getLabel(suite.file);

    if (suite.name === label) {
      const rootItem = testController.createTestItem(
        suite.file + suite.name,
        label,
        getTestURI(label)
      );
      addTestsToTestItem(rootItem, suite.tests);
      addSuitesToTestItem(rootItem, suite.suites);
      testController.items.add(rootItem);
      return;
    }

    const rootItem = testController.createTestItem(
      suite.file + suite.name,
      label,
      getTestURI(label)
    );
    const suiteItem = testController.createTestItem(
      suite.file + suite.name,
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
  tests: Omit<TestResult, "status">[]
) => {
  tests.forEach((test) => {
    testItem.children.add(
      testController.createTestItem(
        test.name,
        test.name,
        getTestURI(getLabel(test.file))
      )
    );
  });
};

const addSuitesToTestItem = (
  testItem: vscode.TestItem,
  suites: BaseTestSuite[]
) => {
  suites.forEach((suite) => {
    const suiteItem = testController.createTestItem(
      suite.file + suite.name,
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

export function deactivate() {}
