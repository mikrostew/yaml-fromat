# yaml-fromat

> Easily read and write YAML Front Matter

# Installation

With your package manager of choice:

`npm i yaml-fromat`

or

`yarn add yaml-fromat`

or

`pnpm add yaml-fromat`


# API

## `readString(string)`

This parses the input string to find the YAML front matter, returning a Promise that resolves to a JSON representation of that front matter. This includes the contents of the rest of the string in `_contents`.

The YAML front matter should be the first thing in the file, with no blank lines before it.

```javascript
const yamlFM = require('yaml-fromat');

yamlFM.readString('---\nkey:value\n---\n\nSome other contents');
```

Returns

```
{
  "key": "value",
  "_contents": "\nSome other contents"
}
```

### Errors

TODO

