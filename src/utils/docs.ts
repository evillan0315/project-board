// src/utils/docs.ts
// ✅ Use `query` and `import` instead of `as`
export const docs = import.meta.glob('/src/docs/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

export function getDocSlugs(): string[] {
  return Object.keys(docs)
    .map((filePath) => {
      const slugMatch = filePath.match(/\/src\/docs\/(.+)\.md$/);
      if (slugMatch) {
        console.log(slugMatch[1], 'slugMatch'); // Uncomment for debugging
        return slugMatch[1];
      }
      return null;
    })
    .filter(Boolean) as string[];
}

export function getDocContent(slug: string): string | null {
  const matchingKey = Object.keys(docs).find((key) => key.endsWith(`${slug}.md`));
  console.log();
  if (!matchingKey) return null;
  // console.log(matchingKey, 'matched key'); // Optional debug
  return docs[matchingKey] as string;
}
