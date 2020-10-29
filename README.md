# yaml-fromat

Read and write YAML front matter. JS library (and eventually CLI).

# Installation

Install the library in your project using your package manager of choice:

* `npm i yaml-fromat`
* `yarn add yaml-fromat`
* `pnpm add yaml-fromat`

Install the CLI globally (I recommend using [Volta](https://github.com/volta-cli/volta) as your Node manager):

* (CLI is not implemented yet, but it will use `npm i -g yaml-fromat` - #17)


# API

## `readFile(file)`

Like `readString`, but for files. Not yet implemented: #18

## `readString(string)`

Returns a Promise that resolves to a JSON object containing the front matter in the input string. This includes the non-front-matter contents (the rest of the string) in `_contents`.

The YAML front matter should be the first thing in the file, with no blank lines before it.

### Examples

Reading YAML front matter from a string

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

TODO


## `writeFile(file, inputYaml)`

Like `writeString`, but for files. Not yet implemented: #19

## `writeString(inputString, inputYaml)`

Returns a Promise that resolves to a string where the input YAML has been combined with the existing front matter from the input string. New data will be appended to the existing front matter. Changes to existing keys will be made in-place. If input string does not contain front matter, a new block of YAML front matter will be added.

This attempts to:
* Preserve blank lines and comments in the YAML
* Maintain the order of existing data

Current limitations, to be addressed:
* When changing data, you can only overwrite the top-level key/value: #20
* There is no way to remove top-level keys: #21
* Multiple blank lines are collapsed to a single line: #22


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

TODO


# CLI

Not yet implemented: #17
