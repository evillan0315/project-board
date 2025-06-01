# Project Board

A developer-focused layout system interface, implemented using TypeScript, Vite, and modern frontend technologies (React and SolidJS). The structure is highly modular and theme-aware, suitable for building extensible applications with sidebar navigation, a collapsible layout, and content-based routing.

---

## 📁 Project Structure

```

vscode-layout/
├── generateStructure.ts              # Utility to generate directory tree structure
├── generateStructureRunner.ts        # CLI runner to generate and save the structure as JSON
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── src/
│   ├── App.tsx                       # Root application component
│   ├── app.css                       # App-level styles
│   ├── index.css                     # Global styles
│   ├── main.tsx                      # App entry point
│   ├── vite.config.ts                # Vite configuration
│   ├── components/
│   │   ├── Logo.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── layouts/
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── LeftSidebar.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   ├── Nav.tsx
│   │   │   ├── RightSidebar.tsx
│   │   │   ├── types.ts
│   │   │   ├── content/
│   │   │   │   ├── Content.tsx
│   │   │   │   ├── ContentHeader.tsx
│   │   │   │   ├── ContentLayout.tsx
│   │   │   ├── react/
│   │   │   │   └── Layout.tsx
│   │   │   ├── solid/
│   │   │   │   └── Layout.tsx
│   │   ├── pages/
│   │       ├── DynamicPage.tsx
│   │       ├── EditorPage.tsx
│   │       ├── Page.tsx
│   │       ├── PageHeader.tsx
│   │       ├── PageSection.tsx
│   ├── configs/                      # (Currently empty)
│   ├── contexts/
│   │   ├── AuthContext.ts
│   │   ├── ThemeContext.tsx
│   │   ├── ThemeProvider.tsx
│   ├── data/
│   │   ├── app.ts
│   │   ├── menus.ts
│   ├── docs/
│   │   └── authentication/
│   │       ├── github-auth-integration.md
│   │       ├── google-auth-Integration.md
│   ├── pages/
│   │   ├── \[slug].tsx
│   │   └── docs/
│   │       └── \[...slug].tsx
│   ├── stores/
│   │   └── theme.ts
│   ├── utils/
│   │   └── docs.ts

```

---

## 🔧 Key Features

- **Visual Studio Code-like Layout**  
  Modular and flexible UI with collapsible sidebars, header, footer, and a content area.

- **Multi-framework Support**  
  React and SolidJS layout components supported side-by-side.

- **Context Management**  
  Theme and authentication context built-in.

- **Theme Toggle**  
  Dark/light mode supported using context and store.

- **Dynamic Pages**  
  Content and route-driven UI, with support for `[slug]` and `[...slug]` pages.

- **Authentication Docs**  
  Detailed markdown documentation for integrating OAuth (Google, GitHub).

- **File Structure Generator**  
  CLI-based utility (`generateStructure.ts`) to traverse and serialize the directory tree as JSON.

---

## 🚀 Scripts

Use `ts-node` to run the structure generator:

```bash
npx ts-node generateStructureRunner.ts .
```

This will create a `structure.json` file representing the current file layout.

---

## 📄 Authentication Documentation

Located under `src/docs/authentication/`:

- `google-auth-Integration.md`
- `github-auth-integration.md`

---

## 📦 Tooling & Stack

- **Language:** TypeScript
- **Bundler:** Vite
- **Frameworks:** React, SolidJS (experimental)
- **Package Manager:** pnpm
- **UI:** Tailwind CSS (implied by component naming conventions)
- **Context Store:** React Context API + custom stores

---

## 🛠️ Planned Enhancements

- Populate `configs/` with environment and runtime configs
- Expand `stores/` and `utils/` for shared logic
- Support SSR or static builds for docs
- Extend authentication system

---

## License

MIT – Feel free to use, extend, and contribute.
