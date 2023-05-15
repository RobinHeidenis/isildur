import * as vscode from "vscode";

export async function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand("isildur.helloWorld", () => {
    vscode.window.showInformationMessage(
      "Hello World from isildur! very cool gamer extension haha"
    );
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
