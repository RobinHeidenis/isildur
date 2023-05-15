import type { BaseTestSuite, TestResult } from "@isildur-testing/api";
import { Isildur } from "@isildur-testing/core";
import * as vscode from "vscode";

const testController = vscode.tests.createTestController(
  "com.isildur.testController",
  "Isildur Test Controller"
);
const runner = new Isildur("jest");

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
    const regex = new RegExp(
      vscode.workspace.workspaceFolders![0]!.uri.fsPath.replace(/\\/gi, "/"),
      "gi"
    );
    const label = suite.file
      .replace(/\\/gi, "/")
      .replace(regex, "")
      .replace("/", "");
    console.log(label);
    console.log(suite.file.match(regex));

    const rootItem = testController.createTestItem(
      suite.file + suite.name,
      label,
      getTestURI(suite.file)
    );
    const suiteItem = testController.createTestItem(
      suite.file + suite.name,
      suite.name,
      getTestURI(suite.file)
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
      testController.createTestItem(test.name, test.name, getTestURI(test.file))
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
      getTestURI(suite.file)
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

export function deactivate() {}
