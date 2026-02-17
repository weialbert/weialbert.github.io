# Albert Wei's Personal Website

My personal portfolio using the following tooling:

* **Astro Framework**: Fast, modern static site generation
* **TypeScript**: Strong typing enforcement for scripting
* **Content-driven Collections**: Blog, projects, photos, and resume content managed with `astro:content` and **Zod schemas** for validation
* **Resume PDF Generation**: Programmatically generated PDFs with `pdf-lib` and **Typst templates**
* **Automated Linting & Formatting**: `Biome`-enforced coding standards and formatting
* **Modern CI/CD Workflows**: Deployment through GitHub Actions for tests, linting, typechecking, and automatic builds/deployments

---

## Adding/Customizing Resumes

All resumes are built on a **single source of truth** [resume.yaml](src/data/resume.yaml) file. Add new experiences, education, publications, or other data there.

Additional resumes can be built via profiles in the [profiles.yaml](src/data/profiles.yaml) file. Resumes using profiles with the `one_page` parameter set to `true` will be enforced via ci checks at build time.

---

## Development Workflow

**Start local development server with live preview and automatic resume generation:**

```bash
npm run dev
```

**Build for production:**

```bash
npm run build
```

**Preview production build locally:**

```bash
npm run preview
```

**Clean build artifacts:**

```bash
npm run clean
npm run clean:full
```

---

## Dependency Management & Updates

* Check for outdated dependencies:

```bash
npm run check
```

* Update all dependencies safely:

```bash
npm run update
```

> Dev tools (`biome`, `depcheck`, `ncu`) are executed via `npx` for reproducibility.

---

## Code Quality & Validation

Run **full dev validation**:

```bash
npm run dev-check
```

* **Lint & format:** Biome ensures consistent coding standards.
* **Typecheck:** TypeScript validates all types and schema contracts.
* **Unused dependency detection:** depcheck identifies stale packages.

---

## Continuous Integration

* GitHub Actions run on pull requests and merges to main:

  * Linting, formatting, and typechecking with Biome and TypeScript
  * Dependency checks with depcheck and npm-check-updates
  * Full production build validation
* Use `npm ci` in CI to install exact versions from `package-lock.json`.
* Ensure `npm run dev-check` passes before deployment to maintain code quality.

---

## Philosophy

This project demonstrates modern frontend engineering practices:

* Strongly-typed content and components for maintainable, error-resistant code.
* Automated workflows for linting, formatting, typechecking, and dependency updates.
* Infrastructure optimized for **performance, static generation, and modular scalability**.
* Leverages modern web tooling without unnecessary global installs (`npx` ensures reproducibility).
