# VSCode Test Code

🚀 A simple VS Code extension demo for automatically handling code snippets and icon imports.

---

## ✨ Features

- ⚡ Fast snippet transformation
- 📦 Auto import handling
- 🧠 Smart code insertion
- 🔥 Lightweight & no config required

---

## 🎬 Demo

> Replace with your own GIF if needed

![Demo](https://raw.githubusercontent.com/wangcheng123/vscode_test_code/stage/images/demo.gif)

---

## 📸 Screenshots

### Before

```text
ArrowDownOutline-v
```

### After

```tsx
<ArrowDownOutline />
```

Automatically imports:

```tsx
import { ArrowDownOutline } from '@ant-design/icons';
```

---

## 🚀 Usage

### Step 1

Type in your editor:

```text
ArrowDownOutline-v
```

---

### Step 2

The extension automatically converts it into:

```tsx
<ArrowDownOutline />
```

---

### Step 3

It will also automatically add import:

```tsx
import { ArrowDownOutline } from '@ant-design/icons';
```

If the import already exists, it will not duplicate it.

---

## 📦 Installation

### From Marketplace

1. Open VS Code
2. Go to Extensions
3. Search:
   ```
   VSCode Test Code
   ```
4. Click Install

---

## 🧩 Example

### Input

```tsx
const App = () => {
  return (
    ArrowDownOutline-v
  );
};

export default App;
```

---

### Output

```tsx
import { ArrowDownOutline } from '@ant-design/icons';

const App = () => {
  return (
    <ArrowDownOutline />
  );
};

export default App;
```

---

## ⚙️ Supported Environments

- VS Code
- TypeScript
- JavaScript
- React (TSX / JSX)

---

## 📁 Project Structure

```text
src/
images/
out/
package.json
README.md
```

---

## ❤️ Tips

- Keep GIF under 5MB for better loading
- Use `raw.githubusercontent.com` for images
- Keep extension lightweight for better performance

---

## 📝 Changelog

### 1.0.0

- Initial release
- Auto icon transform
- Auto import handling

---

## 📄 License

MIT

---

## ⭐ Support

If you like this extension, please consider giving it a ⭐ on GitHub.