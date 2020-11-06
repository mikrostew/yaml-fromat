# yaml-fromat

Read and write YAML front matter. JS library (and eventually CLI).

# Installation

Install the library in your project using your package manager of choice:

* `npm i yaml-fromat`
* `yarn add yaml-fromat`
* `pnpm add yaml-fromat`

Install the CLI globally (I recommend using [Volta](https://github.com/volta-cli/volta) as your Node manager):

* ([CLI is not implemented yet](https://github.com/mikrostew/yaml-fromat/issues/17), but it will use `npm i -g yaml-fromat`)


# API

## readFile(file)

Returns a Promise that resolves to a JSON object containing the front matter in the input file. This includes the non-front-matter contents (the rest of the file) in `_contents`.

The YAML front matter should be the first thing in the file, with no blank lines before it.

```javascript
const yamlFM = require('yaml-fromat');

// file.md contains:
// ---
// key: value
// ---
//
// Some other contents`
yamlFM.readFile('some/file.md').then(console.log);

// {
//   key: 'value',
//   _contents: '\nSome other contents'
// }
```

## readString(string)

Returns a Promise that resolves to a JSON object containing the front matter in the input string. This includes the non-front-matter contents (the rest of the string) in `_contents`.

The YAML front matter should be the first thing in the string, with no blank lines before it.

```javascript
const yamlFM = require('yaml-fromat');

yamlFM.readString(
`---
key: value
---

Some other contents`
).then(console.log);

// {
//   key: 'value',
//   _contents: '\nSome other contents'
// }
```

### Errors

`Error parsing YAML in front matter` if there was a parsing error

`Top level should be a key/value map` if the YAML is not a YAML Map at the top level

`Non-terminated YAML front matter` if the YAML front matter does not have a closing `---` line


## writeFile(file, inputYaml)

Like `writeString`, but for files. [Not yet implemented](https://github.com/mikrostew/yaml-fromat/issues/19)

## writeString(inputString, inputYaml)

Returns a Promise that resolves to a string where the input YAML has been combined with the existing front matter from the input string. New data will be appended to the existing front matter. Changes to existing keys will be made in-place. If input string does not contain front matter, a new block of YAML front matter will be added.

This attempts to:
* Preserve blank lines and comments in the YAML
* Maintain the order of existing data

Current limitations, to be addressed:
* [When changing data, you can only overwrite the top-level key/value](https://github.com/mikrostew/yaml-fromat/issues/20)
* [There is no way to remove top-level keys](https://github.com/mikrostew/yaml-fromat/issues/21)
* [Multiple blank lines are collapsed to a single line](https://github.com/mikrostew/yaml-fromat/issues/22)


### Examples

Adding new data

```javascript
const yamlFM = require('yaml-fromat');

yamlFM.writeString(
`---
foo: bar
---

Some other things`,
'more: data'
).then(console.log);

// ---
// foo: bar
// more: data
// ---
//
// Some other things
```

Changing existing data

```javascript
const yamlFM = require('yaml-fromat');

yamlFM.writeString(
`---
foo: bar
---

Other contents`,
'foo: baz'
).then(console.log);

// ---
// foo: baz
// ---
//
// Other contents
```

### Errors

`Non-terminated YAML front matter` if the YAML front matter does not have a closing `---` line

`Error parsing YAML in front matter` if there was a parsing error

`Error parsing input YAML` if the input YAML cannot be parsed for some reason

`Cannot add non-map items at the top level` if the input YAML is not a Map (so this can't add key/value items)


# CLI

[Not yet implemented](https://github.com/mikrostew/yaml-fromat/issues/17)


# Development

Run the tests with `yarn run test` or `yarn run test --watch`

Check code coverage with `yarn run coverage`
