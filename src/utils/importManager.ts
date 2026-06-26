
import { Project } from 'ts-morph';

export async function updateImport(filePath: string, iconName: string) {
  const project = new Project();
  const file = project.addSourceFileAtPath(filePath);

  const imp = file.getImportDeclaration('@ant-design/icons');

  if (imp) {
    const existing = imp.getNamedImports().map(i => i.getName());
    if (!existing.includes(iconName)) {
      imp.addNamedImport(iconName);
    }
  } else {
    file.addImportDeclaration({
      moduleSpecifier: '@ant-design/icons',
      namedImports: [iconName]
    });
  }

  await file.save();
}
