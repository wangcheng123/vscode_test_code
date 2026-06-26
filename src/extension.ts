import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("🔥 Ant Icon Helper Stable Activated");

  /**
   * =========================
   * 1️⃣ 强制触发补全（解决“没提示”核心问题）
   * =========================
   */
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(() => {
      vscode.commands.executeCommand("editor.action.triggerSuggest");
    })
  );

  /**
   * =========================
   * 2️⃣ Completion（提示）
   * =========================
   */
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      ["typescriptreact", "javascriptreact"],
      {
        provideCompletionItems(document, position) {
          const line = document.lineAt(position).text;
          const beforeCursor = line.slice(0, position.character);

          // ⭐ 关键：只要包含 icon 就能匹配（不依赖 -v 结尾）
          const match = beforeCursor.match(
            /([A-Za-z][A-Za-z0-9]+)(-v)?$/
          );

          if (!match) return;

          const iconName = match[1];

          const item = new vscode.CompletionItem(
            `${iconName}-v`,
            vscode.CompletionItemKind.Snippet
          );

          item.detail = "Ant Design Icon Helper";

          item.insertText = `${iconName}-v`;

          item.command = {
            command: "antIcon.insert",
            title: "Insert Icon",
            arguments: [iconName],
          };

          return [item];
        },
      },
      "-", "v" // ⭐ 双触发，解决你输入 -v 没提示问题
    )
  );

  /**
   * =========================
   * 3️⃣ 回车执行核心逻辑
   * =========================
   */
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "antIcon.insert",
      async (rawIconName: string) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const document = editor.document;
        const text = document.getText();

        const iconName = rawIconName.replace(/-v$/, "");

        let newText = text;

        /**
         * =========================
         * 4️⃣ JSX 替换
         * =========================
         */
        newText = newText.replace(
          new RegExp(`\\b${iconName}-v\\b`, "g"),
          `<${iconName} />`
        );

        /**
         * =========================
         * 5️⃣ import merge
         * =========================
         */
        const importRegex =
          /import\s*\{\s*([^}]*)\s*\}\s*from\s*['"]@ant-design\/icons['"]/;

        const matchImport = importRegex.exec(newText);

        if (matchImport) {
          const existing = matchImport[1]
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean);

          if (!existing.includes(iconName)) {
            existing.push(iconName);
          }

          newText = newText.replace(
            importRegex,
            `import { ${existing.join(", ")} } from '@ant-design/icons'`
          );
        } else {
          newText =
            `import { ${iconName} } from '@ant-design/icons';\n` + newText;
        }

        /**
         * =========================
         * 6️⃣ 写回（安全替换）
         * =========================
         */
        if (newText !== text) {
          const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(text.length)
          );

          await editor.edit((builder) => {
            builder.replace(fullRange, newText);
          });
        }
      }
    )
  );
}

export function deactivate() {}