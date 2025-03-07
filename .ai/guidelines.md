# AI Agent Contribution Guidelines

This document outlines the guidelines for AI agents contributing to this project. Following these guidelines ensures consistency and quality in the codebase.

## Code Contribution Guidelines

### Coding Standards

- Use TypeScript with strict type checking
- Follow the existing code style and patterns
- Use functional components for React
- Use hooks for state management
- Keep components small and focused on a single responsibility
- Use Tailwind CSS for styling
- Write meaningful variable and function names
- Add appropriate comments for complex logic

### Git Workflow

1. **Before committing**:
   - Ensure all tests pass (if applicable)
   - Check code formatting with `npm run format:check`
   - Fix any formatting issues with `npm run format`
   - Verify the application works as expected

2. **Commit Messages**:
   - Use clear and descriptive commit messages
   - Start with a verb in the present tense (e.g., "Add", "Fix", "Update")
   - Keep the first line under 50 characters
   - Add more detailed explanation in the body if necessary
   - Reference related issues or tasks

3. **Commit Process**:
   - Run git-commit at the end of completed tasks
   - Include appropriate tags in the commit message (e.g., `#feature`, `#bugfix`)

### Documentation

- Update documentation when making significant changes
- Document new features, APIs, or components
- Keep the `log.md` file updated with discussions and decisions
- Add comments for complex logic or non-obvious code

## Development Practices

### Feature Development

1. **Planning**:
   - Understand the requirements thoroughly
   - Break down the task into smaller, manageable steps
   - Consider edge cases and potential issues

2. **Implementation**:
   - Follow the coding standards
   - Write clean, maintainable code
   - Reuse existing components and utilities when possible
   - Consider performance implications

3. **Testing**:
   - Test the feature manually
   - Verify it works as expected in different scenarios
   - Check for any regressions

### Bug Fixing

1. **Understanding**:
   - Reproduce the bug
   - Understand the root cause
   - Consider the impact on other parts of the application

2. **Implementation**:
   - Fix the bug without introducing new issues
   - Add safeguards to prevent similar bugs in the future
   - Update tests if necessary

3. **Verification**:
   - Verify the bug is fixed
   - Check for any regressions
   - Document the fix in the commit message

## Communication

- Log important discussions and decisions in `log.md`
- Clearly state any limitations or constraints
- Ask for clarification when requirements are ambiguous
- Provide clear explanations for technical decisions
