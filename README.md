# Codefolio

![logo](./folder-multiple-outline.svg)

Codefolio is a basic portfolio renderer for your projects.

## Features

- Follow simple conventions to produce a standard `Portfolio` object from a Markdown Readme.
- Or bring your own conventions, and just use Codefolio to produce standard `Portfolio` objects.

# Example Usage

Codefolio has a convention for reading a basic body and image from a project's README.md (or README.markdown, README):

- The first level one heading (`# Hi I'm a level one heading`) is where the body of the portfolio begins.
- The text after that heading is the body, until the **next** level one heading is hit - not including any images.
- The first image before the second level one heading in the document is considered the main image for the project.
- All other images before the second level are used as example images.

If following this convention, given this markdown in a `README.md` file:

```markdown
# Hi I'm a level one heading

![img](./img.png)

Here's the body!
```

When passed into Codefolio:

```js
const codefolio = require('codefolio');


const portfolios = await codefolio.promisePortfolios(['README.md']);
```

Produces an object like this:

```json5
{
  body: "# Hi I'm a level one heading\n\nHere's the body!",
  image: {
    url: "./img.png",
    alt: "img",
    title: "img"
  },
  examples: []
}
```

# Contributing

Contributions to Codefolio are welcome. All pull requests must pass the automatic checks - and must be approved by the maintainer of the project. Please file issues and make feature requests through the issues UI at Github.
