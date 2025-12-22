# Resume

This repository builds a resume using Typst and simple templates.

Quick start

Prerequisites:
- Python 3.11+ (or system Python)
- typst (https://typst.org) or installable via Rust/Cargo
- Ghostscript (for ensuring final PDF size and letter paper)

Install Python deps:

```bash
python -m pip install --user -r requirements.txt
```

Build (all):

```bash
uv run make
```

Build only markdown or PDF:

```bash
uv run make md
uv run make pdf
```

Notes

- The Makefile will attempt to install Python deps to the user site if they are missing.
- CI will run `uv run make` and verify that `build/resume.pdf` is created.
- For local typst development, you can install typst via `cargo install typst` or use a platform-specific binary.
