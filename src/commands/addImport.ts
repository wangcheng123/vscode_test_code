
import * as vscode from 'vscode';
import { updateImport } from '../utils/importManager';

export async function addImport(iconName: string) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  await updateImport(editor.document.fileName, iconName);
}
