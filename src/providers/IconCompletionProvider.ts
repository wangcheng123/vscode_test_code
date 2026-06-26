
import * as vscode from 'vscode';

export class IconCompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
    const line = document.lineAt(position.line).text;
    const before = line.substring(0, position.character);

    const match = before.match(/([A-Z][A-Za-z0-9]+)-v$/);
    if (!match) return [];

    const icon = match[1];

    const item = new vscode.CompletionItem(icon, vscode.CompletionItemKind.Snippet);
    item.insertText = new vscode.SnippetString(`<${icon} />`);
    item.command = {
      command: 'ant-icon-helper.addImport',
      title: 'add import',
      arguments: [icon]
    };

    return [item];
  }
}
