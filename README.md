# Codefolio

Codefolio is a basic portfolio renderer for your projects.

## Why?

Codefolio fulfills a niche need: developers often have many side projects, and they want to display them (outside of a 3rd party context such as Github). The challenge in displaying those projects is in keeping the projects updated.

## How?

Codefolio aims to solve this problem by providing a convention for reading a basic **headline**, **summary**, and **image** for the project from the project's README.md (or README.markdown, README):

- The first level one heading (`# Hi I'm a level one heading`) is the headline for the project
- The text after that heading is the body, until the **next** level one heading is hit - not including any images
- The first image before the second level one heading in the document is considered the logo for the project

# Example Usage

Portfolio outputs a set of Markdown documents into a normalized array of `Portfolio` objects.

```javascript
import portfolio from 'portfolio'

const portfolios = await portfolio.promisePortfolios('./sandbox/codefolio');

// Do things with portfolios...
```

# Contributing

Contributions to Codefolio are welcome. All pull requests must pass the automatic checks - and must be approved by the maintainer of the project. Please file issues and make feature requests through the issues UI at Github.
