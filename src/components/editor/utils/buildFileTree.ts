export default function buildTree(files: FileItem[] = []): FileItem[] {
  const map = new Map<string, FileItem & { children: FileItem[] }>();
  files.forEach((file) => map.set(file.path, { ...file, children: [] }));

  const tree: FileItem[] = [];
  for (const file of map.values()) {
    const parentPath = path.dirname(file.path);
    if (parentPath === '.' || parentPath === file.path) {
      tree.push(file);
    } else {
      const parent = map.get(parentPath);
      if (parent) {
        parent.children.push(file);
      } else {
        console.warn(`Orphaned file/folder: ${file.path}`);
        tree.push(file);
      }
    }
  }

  const sortTree = (nodes: FileItem[]) => {
    nodes.sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((n) => n.children?.length && sortTree(n.children));
  };

  sortTree(tree);
  return tree;
}
