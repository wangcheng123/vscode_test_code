import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("🔥 Ant Icon QuickPick Confirm Edition");

  let timer: NodeJS.Timeout | undefined;

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      if (event.document !== editor.document) return;

      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        const line = editor.document.lineAt(
          editor.selection.active.line
        ).text;

        const match = line.match(/([A-Za-z][A-Za-z0-9]*)-v$/);

        if (!match) return;

        const iconName = match[1];

        showQuickPick(editor, iconName);
      }, 80);
    })
  );
}

/**
 * =========================
 * 🎯 弹框确认（核心）
 * =========================
 */
async function showQuickPick(
  editor: vscode.TextEditor,
  iconName: string
) {
  const choice = await vscode.window.showQuickPick(
    [
      {
        label: `✔ Replace with <${iconName} />`,
        description: "Press Enter to confirm",
      },
      {
        label: "✖ Cancel",
        description: "Do nothing",
      },
    ],
    {
      placeHolder: `Ant Icon Helper: ${iconName}`,
      ignoreFocusOut: true,
    }
  );

  if (!choice || choice.label.startsWith("✖")) return;

  applyInsert(editor, iconName);
}

/**
 * =========================
 * 🔧 执行替换 + import
 * =========================
 */
async function applyInsert(
  editor: vscode.TextEditor,
  iconName: string
) {
  const document = editor.document;
  const line = document.lineAt(editor.selection.active.line);

  const replacedLine = line.text.replace(
    new RegExp(`${iconName}-v`, "g"),
    `<${iconName} />`
  );

  await editor.edit((eb) => {
    eb.replace(line.range, replacedLine);
  });

  /**
   * =========================
   * import 自动处理
   * =========================
   */
  const fullText = document.getText();

  const importRegex =
    /import\s*\{\s*([^}]*)\s*\}\s*from\s*['"]@ant-design\/icons['"]/;

  const matchImport = importRegex.exec(fullText);

  if (matchImport) {
    const existing = matchImport[1]
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    if (!existing.includes(iconName)) {
      existing.push(iconName);
    }

    const newImport = `import { ${existing.join(
      ", "
    )} } from '@ant-design/icons'`;

    const range = new vscode.Range(
      document.positionAt(matchImport.index),
      document.positionAt(
        matchImport.index + matchImport[0].length
      )
    );

    await editor.edit((eb) => eb.replace(range, newImport));
  } else {
    await editor.edit((eb) => {
      eb.insert(
        new vscode.Position(0, 0),
        `import { ${iconName} } from '@ant-design/icons';\n`
      );
    });
  }
}

export function deactivate() {}