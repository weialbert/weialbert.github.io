#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Automatic Commit Squasher ===${NC}"
echo

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Not a git repository${NC}"
    exit 1
fi

# Check for uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
    echo -e "${YELLOW}⚠️  Warning: You have uncommitted changes${NC}"
    git status --short
    echo
    read -p "Stash changes and continue? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git stash push -m "Auto-stash before squashing"
        STASHED=1
    else
        exit 1
    fi
fi

# Create backup branch
BACKUP_BRANCH="backup-before-squash-$(date +%Y%m%d-%H%M%S)"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
git branch "$BACKUP_BRANCH"
echo -e "${GREEN}✓ Created backup branch: $BACKUP_BRANCH${NC}"
echo

# Show current commit history
echo -e "${BLUE}Current commit history:${NC}"
git log --oneline --graph -27
echo

# Proposed squashing plan
echo -e "${BLUE}=== Proposed Squashing Plan ===${NC}"
echo
echo "This will create 9 new commits by cherry-picking specific commit states:"
echo
echo -e "${GREEN}1.${NC} feat: initial project setup with uv and CI (7cc5157)"
echo -e "${GREEN}2.${NC} feat: add data structure and watch mode (bd135ee)"
echo -e "${GREEN}3.${NC} fix: improve template formatting (a1bfbb1)"
echo -e "${GREEN}4.${NC} feat: implement resume rendering (39b9b1d)"
echo -e "${GREEN}5.${NC} feat: add HTML output and deployment (9b77eec)"
echo -e "${GREEN}6.${NC} docs: improve documentation and CI (359bbcf)"
echo -e "${GREEN}7.${NC} feat: add version control and organization (cda13e7)"
echo -e "${GREEN}8.${NC} feat: add CSS and update homepage (f983432)"
echo -e "${GREEN}9.${NC} feat: release v0.1.2 and recent updates (4880a06)"
echo
read -p "Proceed with automatic squashing? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Aborted${NC}"
    exit 0
fi

# Create new orphan branch
TEMP_BRANCH="temp-squash-$(date +%s)"
git checkout --orphan "$TEMP_BRANCH"

# Remove all files from staging
git rm -rf . > /dev/null 2>&1 || true

echo -e "${BLUE}Creating squashed commits...${NC}"
echo

# Group 1: Initial Setup - use state at 7cc5157
echo -e "${YELLOW}[1/9]${NC} Creating initial setup commit..."
git checkout "$BACKUP_BRANCH" 7cc5157 -- . 2>/dev/null || git checkout 7cc5157 -- .
if [[ -n $(git status --porcelain) ]]; then
    git add -A
    git commit -m "feat: initial project setup with uv and CI

- Add Makefile with setup target
- Add README and CI workflow
- Switch to uv-based dependency management
- Add .gitignore for build metadata"
    echo "  ✓ Created commit 1"
else
    echo "  ⚠ No changes to commit"
fi

# Group 2: Data & Watch - use state at bd135ee
echo -e "${YELLOW}[2/9]${NC} Creating data structure commit..."
git checkout "$BACKUP_BRANCH" bd135ee -- . 2>/dev/null || git checkout bd135ee -- .
if [[ -n $(git status --porcelain) ]]; then
    git add -A
    git commit -m "feat: add data structure and watch mode

- Populate data file from archive
- Add 'make watch' target with auto-rebuild
- Consolidate education into degrees list"
    echo "  ✓ Created commit 2"
else
    echo "  ⚠ No changes to commit"
fi

# Group 3: Template fixes - use state at a1bfbb1
echo -e "${YELLOW}[3/9]${NC} Creating template improvements commit..."
git checkout "$BACKUP_BRANCH" a1bfbb1 -- . 2>/dev/null || git checkout a1bfbb1 -- .
if [[ -n $(git status --porcelain) ]]; then
    git add -A
    git commit -m "fix: improve template formatting

- Use sentinel file to avoid repeated uv sync
- Add GPA and awards display
- Format as indented sub-bullets"
    echo "  ✓ Created commit 3"
else
    echo "  ⚠ No changes to commit"
fi

# Group 4: Rendering - use state at 39b9b1d
echo -e "${YELLOW}[4/9]${NC} Creating rendering commit..."
git checkout "$BACKUP_BRANCH" 39b9b1d -- . 2>/dev/null || git checkout 39b9b1d -- .
if [[ -n $(git status --porcelang) ]]; then
    git add -A
    git commit -m "feat: implement resume rendering

- Format initial resume
- Update typst installation in CI"
    echo "  ✓ Created commit 4"
else
    echo "  ⚠ No changes to commit"
fi

# Group 5: HTML & Deployment - use state at 9b77eec
echo -e "${YELLOW}[5/9]${NC} Creating HTML deployment commit..."
git checkout "$BACKUP_BRANCH" 9b77eec -- . 2>/dev/null || git checkout 9b77eec -- .
if [[ -n $(git status --porcelain) ]]; then
    git add -A
    git commit -m "feat: add HTML output and deployment

- Add HTML generation
- Initial deployment setup
- Update homepage"
    echo "  ✓ Created commit 5"
else
    echo "  ⚠ No changes to commit"
fi

# Group 6: Documentation - use state at 359bbcf
echo -e "${YELLOW}[6/9]${NC} Creating documentation commit..."
git checkout "$BACKUP_BRANCH" 359bbcf -- . 2>/dev/null || git checkout 359bbcf -- .
if [[ -n $(git status --porcelain) ]]; then
    git add -A
    git commit -m "docs: improve documentation and CI

- Add detailed build checks
- Update README
- Reduce CI workflow duplication"
    echo "  ✓ Created commit 6"
else
    echo "  ⚠ No changes to commit"
fi

# Group 7: Organization - use state at cda13e7
echo -e "${YELLOW}[7/9]${NC} Creating organization commit..."
git checkout "$BACKUP_BRANCH" cda13e7 -- . 2>/dev/null || git checkout cda13e7 -- .
if [[ -n $(git status --porcelain) ]]; then
    git add -A
    git commit -m "feat: add version control and organization

- Improve project organization
- Add version control from pyproject.toml
- Initial release setup"
    echo "  ✓ Created commit 7"
else
    echo "  ⚠ No changes to commit"
fi

# Group 8: CSS - use state at f983432
echo -e "${YELLOW}[8/9]${NC} Creating CSS commit..."
git checkout "$BACKUP_BRANCH" f983432 -- . 2>/dev/null || git checkout f983432 -- .
if [[ -n $(git status --porcelain) ]]; then
    git add -A
    git commit -m "feat: add CSS styling and fix homepage

- Add CSS files to index.html
- Fix homepage links"
    echo "  ✓ Created commit 8"
else
    echo "  ⚠ No changes to commit"
fi

# Group 9: Recent - use state at 4880a06 (HEAD)
echo -e "${YELLOW}[9/9]${NC} Creating final updates commit..."
git checkout "$BACKUP_BRANCH" 4880a06 -- . 2>/dev/null || git checkout 4880a06 -- .
if [[ -n $(git status --porcelain) ]]; then
    git add -A
    git commit -m "feat: release v0.1.2 and recent updates

- Release v0.1.2
- Update skills
- Fix and update release workflow"
    echo "  ✓ Created commit 9"
else
    echo "  ⚠ No changes to commit"
fi

echo
echo -e "${GREEN}✓ Commit creation complete!${NC}"
echo

# Show new history
echo -e "${BLUE}New commit history:${NC}"
git log --oneline --graph --all -15
echo

# Count commits
NEW_COUNT=$(git rev-list --count HEAD)
echo -e "${GREEN}Successfully created $NEW_COUNT commits${NC}"
echo

# Confirm before replacing main
echo -e "${YELLOW}=== Ready to Replace Branch ===${NC}"
echo "This will replace '$CURRENT_BRANCH' with the squashed history."
echo
read -p "Replace current branch? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Force the original branch to point to our new commits
    git branch -f "$CURRENT_BRANCH" "$TEMP_BRANCH"
    git checkout "$CURRENT_BRANCH"
    git branch -D "$TEMP_BRANCH" 2>/dev/null || true
    
    echo
    echo -e "${GREEN}✓ Branch '$CURRENT_BRANCH' replaced successfully!${NC}"
else
    echo -e "${YELLOW}Keeping temporary branch: $TEMP_BRANCH${NC}"
    echo "To manually merge: git checkout $CURRENT_BRANCH && git reset --hard $TEMP_BRANCH"
    git checkout "$CURRENT_BRANCH"
fi

echo
echo -e "${YELLOW}=== Next Steps ===${NC}"
echo "1. Review the new commit history:"
echo "   ${BLUE}git log --oneline --graph -15${NC}"
echo
echo "2. Test your code to ensure everything works"
echo
echo "3. Force push to update remote:"
echo "   ${BLUE}git push --force-with-lease${NC}"
echo
echo "4. If something went wrong, restore from backup:"
echo "   ${BLUE}git reset --hard $BACKUP_BRANCH${NC}"
echo

if [[ -n $STASHED ]]; then
    echo "5. Restore your stashed changes:"
    echo "   ${BLUE}git stash pop${NC}"
    echo
fi

echo -e "${GREEN}Backup branch: $BACKUP_BRANCH${NC}"
echo "Delete it later with: ${BLUE}git branch -D $BACKUP_BRANCH${NC}"