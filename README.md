# Codefolio

Codefolio is a basic portfolio renderer for your git projects. It is reliant on just 3 items:

1. A list of git repos
2. For each git repo, a headline section for each project. By default, this will be the first `#` headline and the text within it. This can also be configured per project to be a different file.
3. For each git repo, a headline image for each project. By default this will be the first image in the project's README. Again, this can be configured per project.

# Example Usage

Portfolio outputs a set of Markdown documents into a normalized array of `Portfolio` objects.

```javascript
import portfolio from 'portfolio'

const portfolios = await portfolio.promisePortfolios('https://github.com/namehillsoftware/projectBlue.git');

// Do things with portfolios...
```