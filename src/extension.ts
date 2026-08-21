import * as vscode from "vscode";
import { addImport } from "./commands/addImport";
import { IconCompletionProvider } from "./providers/IconCompletionProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log("🔥 Ant Icon Stable No Delete Trigger");

  const completionProvider = new IconCompletionProvider();
  let timer: ReturnType<typeof setTimeout> | undefined;

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "ant-icon-helper.addImport",
      async (iconName?: string) => {
        if (!iconName) {
          return;
        }

        await addImport(iconName);
      }
    ),
    vscode.languages.registerCompletionItemProvider(
      [{ language: "typescriptreact" }, { language: "javascriptreact" }],
      completionProvider,
      "-"
    ),
    vscode.workspace.onDidChangeTextDocument((event) => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      if (event.document !== editor.document) return;

      /**
       * 🚨 核心修复 1：
       * 如果是删除行为 → 直接跳过
       */
      // ❌ 批量改动（格式化、重构等系统行为）→ 直接跳过
      if (event.contentChanges.length > 1) {
        return;
      }

      const change = event.contentChanges[0];
      if (!change) return;

      // ❌ 删除 / undo / backspace
      if (!change.text || change.text.length === 0) {
        return;
      }

      // ❌ 粘贴大段（可选过滤，防误触发）
      if (change.text.length > 20) {
        return;
      }

      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        // 触发前再确认当前激活编辑器没变，且弹框未在显示
        if (vscode.window.activeTextEditor !== editor) return;

        const line = editor.document.lineAt(
          editor.selection.active.line
        ).text;

        /**
         * 🚨 核心修复 2：
         * 只匹配“完整 token”
         */
        const match = line.match(
          /([A-Za-z][A-Za-z0-9]*)-v$/
        );

        if (!match) return;

        const iconName = match[1];

        showQuickPick(editor, iconName);
      }, 80);
    })
  );
}

/**
 * =========================
 * 弹框
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
      },
      {
        label: "✖ Cancel",
      },
    ],
    {
      placeHolder: `Ant Icon Helper: ${iconName}`,
      ignoreFocusOut: false,
    }
  );

  if (!choice || choice.label.startsWith("✖")) return;

  applyInsert(editor, iconName);
}

/**
 * =========================
 * 替换逻辑（不变）
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