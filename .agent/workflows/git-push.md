---
description: Push changes to GitHub repository after any modifications
---

# Git Push Workflow

Setiap ada perubahan atau penambahan file di project Landing Page Builder, WAJIB push ke GitHub.

## Repository
```
https://github.com/add146/landing.git
```

## Steps

// turbo-all

1. Navigate to project folder
```bash
cd "c:\Aplikasi\Landing Page"
```

2. Check status
```bash
git status
```

3. Add all changes
```bash
git add .
```

4. Commit with descriptive message
```bash
git commit -m "feat: [description of changes]"
```

5. Push to remote
```bash
git push origin main
```

## Commit Message Format

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks

## Example
```bash
git add .
git commit -m "feat: add authentication API endpoints"
git push origin main
```

## Initial Setup (if not initialized)
```bash
cd "c:\Aplikasi\Landing Page"
git init
git remote add origin https://github.com/add146/landing.git
git add .
git commit -m "Initial commit"
git push -u origin main
```
