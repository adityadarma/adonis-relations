# Adonis Relationship Nested

[![gh-workflow-image]][gh-workflow-url] [![npm-image]][npm-url] [![npm-downloads]][npm-downloads] ![][typescript-image] [![license-image]][license-url]

A utility to safely and elegantly handle nested relationships in AdonisJS using strict typing and intuitive syntax.

## Installation

```sh
node ace add @adityadarma/adonis-relations
```

## Usage

```ts
await User.query().withRelation([
  'relationName:id,name',
  'relationName.relationName2:id,name',
  'relationName.relationName2.relationName3.relationName4',
  {
    'relationName.relationName2': function (query: any) {
      query.select('*')
    },
  },
])
```

## License

This package is open-sourced software licensed under the [MIT license](LICENSE.md).

[gh-workflow-image]: https://img.shields.io/github/actions/workflow/status/adityadarma/adonis-relations/release.yml?style=for-the-badge
[gh-workflow-url]: https://github.com/adityadarma/adonis-relations/actions/workflows/release.yml 'Github action'
[npm-image]: https://img.shields.io/npm/v/@adityadarma/adonis-relations/latest.svg?style=for-the-badge&logo=npm
[npm-url]: https://www.npmjs.com/package/@adityadarma/adonis-relations/v/latest 'npm'
[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[license-url]: LICENSE.md
[license-image]: https://img.shields.io/github/license/adityadarma/adonis-relations?style=for-the-badge
[npm-downloads]: https://img.shields.io/npm/dm/@adityadarma/adonis-relations.svg?style=for-the-badge
[count-downloads]: https://npmcharts.com/compare/@adityadarma/adonis-relations?minimal=true
