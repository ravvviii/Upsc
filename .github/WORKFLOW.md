# 🚀 Git Workflow Guide

## 📋 Branch Structure

- **`master`** - Production branch (protected)
- **`staging`** - Pre-production branch
- **`feature/*`** - Feature development branches
- **`hotfix/*`** - Emergency fixes
- **`bugfix/*`** - Bug fixes

## 🔄 Workflow Process

### For Developers:

1. **Create Feature Branch**
   ```bash
   git checkout master
   git pull origin master
   git checkout -b feature/your-feature-name
   ```

2. **Develop & Commit**
   ```bash
   git add .
   git commit -m "✨ Add your feature description"
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request**
   - Go to GitHub and create PR to `master`
   - Fill out the PR template
   - Wait for approval from @ravvviii

### For Repository Owner (@ravvviii):

1. **Review PRs**
   - Check code quality
   - Test functionality
   - Approve or request changes

2. **Manual Triggers**
   ```bash
   # Manually trigger staging merge
   gh workflow run "Auto Merge to Staging"
   
   # Manually trigger production merge
   gh workflow run "Auto Merge Staging to Master"
   ```

## ⏰ Automated Schedule

- **11:00 PM** - Approved PRs auto-merge to `staging`
- **6:00 PM** - `staging` auto-merges to `master` (production)

## 🛡️ Branch Protection Rules

**Master Branch Protection:**
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Restrict pushes to admins only
- Require signed commits (optional)

## 🚀 OTA Updates

- **Master push** → Production OTA update
- **Staging push** → Staging OTA update
- **Feature branch** → Development OTA update

## 📱 Testing Channels

- **Production**: `eas update --branch production`
- **Staging**: `eas update --branch staging`
- **Development**: `eas update --branch development`

## 🎯 Quick Commands

```bash
# Test OTA update manually
npm run ota-update

# Preview update
npm run ota-update:preview

# Production update
npm run ota-update:production

# Check expo doctor
npx expo-doctor

# Validate setup
npm run lint
```