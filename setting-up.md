# Setting Up Development Environment: GitHub & Cursor

This guide will walk you through setting up GitHub and Cursor for efficient development with AI assistance.

## Table of Contents
- [GitHub Setup](#github-setup)
- [Cursor Setup](#cursor-setup)
- [Using Cursor with AI Agents](#using-cursor-with-ai-agents)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## GitHub Setup

### 1. Create a GitHub Account
1. Go to [github.com](https://github.com)
2. Click "Sign up" and follow the registration process
3. Verify your email address

### 2. Install Git
**macOS (using Homebrew):**
```bash
brew install git
```

**Windows:**
- Download from [git-scm.com](https://git-scm.com)
- Run the installer

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install git
```

### 3. Configure Git
Set up your identity:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 4. Set Up SSH Keys (Recommended)
1. Generate SSH key:
```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
```

2. Add SSH key to SSH agent:
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

3. Copy public key:
```bash
cat ~/.ssh/id_ed25519.pub
```

4. Add to GitHub:
   - Go to GitHub Settings → SSH and GPG keys
   - Click "New SSH key"
   - Paste your public key

### 5. Basic Git Commands
```bash
# Clone a repository
git clone <repository-url>

# Check status
git status

# Add files to staging
git add <filename>
git add .  # Add all files

# Commit changes
git commit -m "Your commit message"

# Push to remote
git push origin main

# Pull latest changes
git pull origin main

# Create and switch to new branch
git checkout -b feature-name

# Switch branches
git checkout branch-name
```

## Cursor Setup

### 1. Download and Install Cursor
1. Go to [cursor.sh](https://cursor.sh)
2. Download for your operating system
3. Install and launch Cursor

### 2. Sign In to Cursor
1. Open Cursor
2. Click "Sign In" or "Get Started"
3. Choose your authentication method (GitHub, Google, etc.)

### 3. Install Extensions
Cursor comes with many built-in features, but you can enhance it with extensions:
- Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
- Search for popular extensions like:
  - Python
  - JavaScript
  - GitLens
  - Auto Rename Tag
  - Bracket Pair Colorizer

### 4. Configure Settings
1. Open Settings (Ctrl+, / Cmd+,)
2. Customize your preferences:
   - Theme
   - Font size
   - Tab size
   - Auto-save
   - Format on save

## Using Cursor with AI Agents

### 1. Accessing AI Features
- **Chat Panel**: Press `Ctrl+L` (Windows/Linux) or `Cmd+L` (Mac)
- **Inline AI**: Press `Ctrl+K` (Windows/Linux) or `Cmd+K` (Mac)
- **Command Palette**: Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)

### 2. Chat with AI
1. Open the chat panel (`Ctrl+L` / `Cmd+L`)
2. Type your question or request
3. Examples:
   - "Explain this code"
   - "Add error handling to this function"
   - "Refactor this component"
   - "Write tests for this function"

### 3. Inline AI Commands
Use `Ctrl+K` / `Cmd+K` for quick AI assistance:
- Select code and ask for explanations
- Request code improvements
- Ask for documentation
- Get debugging help

### 4. AI-Powered Code Generation
1. Open chat panel
2. Describe what you want to build
3. Examples:
   ```
   "Create a React component for a user profile card"
   "Write a Python function to validate email addresses"
   "Build a simple API endpoint for user authentication"
   ```

### 5. Code Review and Refactoring
- Ask AI to review your code: "Review this code for best practices"
- Request refactoring: "Refactor this function to be more readable"
- Get optimization suggestions: "How can I optimize this code?"

### 6. Debugging with AI
- Paste error messages and ask for solutions
- "Why is this code not working?"
- "Help me debug this issue"

### 7. Documentation Generation
- Ask AI to generate comments: "Add comments to explain this code"
- Request README updates: "Update the README with this new feature"
- Generate API documentation: "Create documentation for this API"

## Best Practices

### GitHub Best Practices
1. **Meaningful Commit Messages**
   - Use present tense: "Add user authentication" not "Added user authentication"
   - Be descriptive but concise
   - Use conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`

2. **Branch Naming**
   - Use descriptive names: `feature/user-authentication`
   - Use prefixes: `feature/`, `bugfix/`, `hotfix/`, `docs/`

3. **Pull Request Workflow**
   - Create feature branches for new work
   - Write clear PR descriptions
   - Request code reviews
   - Keep PRs small and focused

### Cursor AI Best Practices
1. **Be Specific**
   - Instead of "fix this", say "fix the null pointer exception in the login function"
   - Provide context about your project and requirements

2. **Iterative Development**
   - Start with basic requests, then refine
   - Ask follow-up questions for clarification
   - Use AI to explain complex concepts

3. **Code Review**
   - Always review AI-generated code
   - Understand what the code does before using it
   - Test AI-generated code thoroughly

4. **Learning**
   - Ask AI to explain concepts you don't understand
   - Use AI to learn new technologies
   - Request best practices and patterns

### Project Organization
1. **File Structure**
   ```
   project/
   ├── src/
   │   ├── components/
   │   ├── utils/
   │   └── styles/
   ├── tests/
   ├── docs/
   ├── README.md
   └── .gitignore
   ```

2. **Documentation**
   - Keep README updated
   - Document setup instructions
   - Include examples and usage

## Troubleshooting

### Common Git Issues
1. **Authentication Errors**
   - Verify SSH keys are properly set up
   - Check GitHub account settings
   - Use personal access tokens if needed

2. **Merge Conflicts**
   - Use `git status` to see conflicted files
   - Edit files to resolve conflicts
   - Use `git add` and `git commit` to complete merge

3. **Undoing Changes**
   ```bash
   # Undo last commit (keep changes)
   git reset --soft HEAD~1
   
   # Undo last commit (discard changes)
   git reset --hard HEAD~1
   
   # Undo uncommitted changes
   git checkout -- <filename>
   ```

### Common Cursor Issues
1. **AI Not Responding**
   - Check internet connection
   - Restart Cursor
   - Verify account is properly signed in

2. **Extensions Not Working**
   - Reload Cursor (Ctrl+Shift+P → "Developer: Reload Window")
   - Check extension compatibility
   - Update Cursor to latest version

3. **Performance Issues**
   - Close unnecessary files
   - Disable unused extensions
   - Increase memory allocation if needed

## Additional Resources

### Git Learning Resources
- [GitHub Guides](https://guides.github.com/)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Desktop](https://desktop.github.com/) (GUI alternative)

### Cursor Resources
- [Cursor Documentation](https://cursor.sh/docs)
- [Cursor Discord](https://discord.gg/cursor)
- [Cursor YouTube Channel](https://www.youtube.com/@cursor-ai)

### AI Development Resources
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [GitHub Copilot](https://github.com/features/copilot)
- [AI Development Best Practices](https://github.com/microsoft/AI-For-Beginners)

## Getting Started Checklist

- [ ] Create GitHub account
- [ ] Install Git
- [ ] Configure Git with your details
- [ ] Set up SSH keys
- [ ] Download and install Cursor
- [ ] Sign in to Cursor
- [ ] Install useful extensions
- [ ] Create your first repository
- [ ] Make your first commit
- [ ] Try AI chat in Cursor
- [ ] Generate some code with AI
- [ ] Push code to GitHub
