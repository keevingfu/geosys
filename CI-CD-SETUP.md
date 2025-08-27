# CI/CD Setup for Dymesty AI Glasses Content Intelligence Center

## Security Configuration

### Environment Variables (.env)
Your sensitive credentials are stored in `.env` file which is:
- ✅ Ignored by Git (via .gitignore)
- ✅ Never uploaded to GitHub
- ✅ Only exists locally on your machine

### Token Security
- GitHub token is stored securely in `.env`
- The token is only used during push operations
- Never hardcode tokens in scripts or code files

## Auto-Sync Features

### 1. Manual Auto-Sync
Run the auto-sync script anytime:
```bash
./auto-sync.sh
```

This script will:
- Add all changes
- Create a commit with timestamp
- Push to GitHub using your secure token

### 2. Automatic Push After Commits
Every time you make a commit, changes are automatically pushed to GitHub.
This is handled by the git post-commit hook.

### 3. Quick Commands

**Option 1: Use the auto-sync script**
```bash
# Make your changes, then run:
./auto-sync.sh
```

**Option 2: Traditional git workflow (auto-push enabled)**
```bash
# Make your changes
git add .
git commit -m "Your message"
# Push happens automatically!
```

## Adding More API Keys

Edit `.env` file to add more keys:
```env
# Add your keys here
OPENAI_API_KEY=your-key-here
ANTHROPIC_API_KEY=your-key-here
# etc.
```

## Security Best Practices

1. **NEVER** commit the `.env` file
2. **NEVER** share your tokens publicly
3. **REGULARLY** rotate your tokens
4. **IMMEDIATELY** revoke compromised tokens

## Troubleshooting

### Push Failed
1. Check your internet connection
2. Verify token hasn't expired
3. Check token permissions on GitHub

### Token Issues
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` scope
3. Update `.env` file with new token

## Important Files

- `.env` - Stores your secrets (git-ignored)
- `.gitignore` - Prevents secrets from being uploaded
- `auto-sync.sh` - Manual sync script
- `.git/hooks/post-commit` - Automatic push hook

## Disabling Auto-Push

If you want to disable automatic pushing:
```bash
rm .git/hooks/post-commit
```

## Re-enabling Auto-Push

```bash
cp .git/hooks/post-commit.backup .git/hooks/post-commit
chmod +x .git/hooks/post-commit
```