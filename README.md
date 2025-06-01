# Project Board

A developer-focused layout system interface, implemented using TypeScript, Vite, and modern frontend technologies (React and SolidJS). The structure is highly modular and theme-aware, suitable for building extensible applications with sidebar navigation, a collapsible layout, and content-based routing.

---

## 📸 Screenshots

| Login Page | Homepage | Dashboard |
|------------|----------|-----------|
| ![Login](./project-board-login.png) | ![Homepage](./homepage-project-board.png) | ![Dashboard](./dashboard-screen.png) |

---

## 📁 Project Structure

```

project-board/
│
├── .gitignore
├── README.md
├── index.html
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── prettier.config.cjs
│
├── dist/                          # Compiled output files
│   ├── *...slug*-Dt0TiDlw\.js
│   ├── index-G72cJpw\_.js
│   ├── index.js
│   └── vscode-layout.css
│
├── libs/                          # Utility scripts
│   ├── generateStructure.ts
│   └── generateStructureRunner.ts
│
├── src/                           # Application source
│   ├── App.tsx
│   ├── app.css
│   │
│   ├── components/                # Reusable UI components
│   │   ├── Editor.tsx
│   │   ├── FeatureCard.tsx
│   │   ├── Hero.tsx
│   │   ├── Loading.tsx
│   │   ├── LoginForm.tsx
│   │   ├── Logo.tsx
│   │   ├── MetricCard.tsx
│   │   ├── SignInWithGithub.tsx
│   │   ├── SignInWithGoogle.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── docs/
│   │   │   └── DocPageList.tsx
│   │   ├── layouts/               # Layout structure and navigation
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── LeftSidebar.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   ├── Nav.tsx
│   │   │   ├── RightSidebar.tsx
│   │   │   ├── types.ts
│   │   │   └── content/
│   │   │       ├── Content.tsx
│   │   │       ├── ContentHeader.tsx
│   │   │       └── ContentLayout.tsx
│   │   ├── pages/                 # Application pages
│   │   │   ├── DynamicPage.tsx
│   │   │   ├── Page.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   └── PageSection.tsx
│   │   └── routes/
│   │       └── ProtectedRoute.tsx
│   │
│   ├── configs/                   # Configuration files (empty)
│   ├── contexts/                 # React context providers
│   │   ├── AuthContext.tsx
│   │   └── ThemeProvider.tsx
│   └── data/                     # Static data files
│       ├── app.ts
│       └── menus.ts

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

* `google-auth-Integration.md`
* `github-auth-integration.md`

---

## 📦 Tooling & Stack

* **Language:** TypeScript
* **Bundler:** Vite
* **Frameworks:** React, SolidJS (experimental)
* **Package Manager:** pnpm
* **UI:** Tailwind CSS
* **Context Store:** React Context API + custom stores

---

## 🛠️ Planned Enhancements

* Populate `configs/` with environment and runtime configs
* Expand `stores/` and `utils/` for shared logic
* Support SSR or static builds for docs
* Extend authentication system

---

## License

MIT – Feel free to use, extend, and contribute.



