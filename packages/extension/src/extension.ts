import type { BaseTestSuite, TestResult } from "@isildur-testing/api";
import { Isildur } from "@isildur-testing/core";
import path from "node:path";
import * as vscode from "vscode";

const testController = vscode.tests.createTestController(
  "com.isildur.testController",
  "Isildur Test Controller"
);
const runner = new Isildur("mocha");

if (vscode.workspace.workspaceFolders) {
  process.chdir(vscode.workspace.workspaceFolders[0]!.uri.fsPath);
}

export async function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("isildur.helloWorld", () => {
    vscode.window.showInformationMessage(
      "Hello World from isildur! very cool gamer extension haha"
    );
  });

  context.subscriptions.push(disposable);

  const results = await runner.discoverAllTests();

  results.forEach((suite) => {
    const label = getLabel(suite.file);

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
