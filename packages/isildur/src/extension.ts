import type { BaseTestSuite, TestResult } from "@isildur-testing/api";
import { Isildur } from "@isildur-testing/core";
import * as vscode from "vscode";

const testController = vscode.tests.createTestController(
  "com.isildur.testController",
  "Isildur Test Controller"
);
const runner = new Isildur(
  "jest",
  vscode.workspace.workspaceFolders![0].uri.fsPath
);

export async function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("isildur.helloWorld", () => {
    vscode.window.showInformationMessage(
      "Hello World from isildur! very cool gamer extension haha"
    );
  });

  context.subscriptions.push(disposable);

  const results = await runner.discoverAllTests();
  console.log(results);

  results.forEach((suite) => {
    const rootItem = testController.createTestItem(
      suite.file + suite.name,
      `${suite.file.split("/").pop()}`,
      vscode.Uri.file(suite.file)
    );
    addTestsToTestItem(rootItem, suite.tests);
    addSuitesToTestItem(rootItem, suite.suites);
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
        vscode.Uri.file(test.file)
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
      `${suite.file.split("/").pop()}`,
      vscode.Uri.file(suite.file)
    );
    addTestsToTestItem(suiteItem, suite.tests);
    addSuitesToTestItem(suiteItem, suite.suites);
    testItem.children.add(suiteItem);
  });
};

export function deactivate() {}
