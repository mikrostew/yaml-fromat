# yaml-fromat

> Easily read and write YAML Front Matter

# Installation

With your package manager of choice:

* `npm i yaml-fromat`
* `yarn add yaml-fromat`
* `pnpm add yaml-fromat`


# API

## `readString(string)`


Returns a Promise that resolves to JSON representation of the front matter in the input string. This includes the non-front-matter contents (the rest of the string) in `_contents`.

The YAML front matter should be the first thing in the file, with no blank lines before it.

### Examples

Reading YAML front matter from a string

```javascript
const yamlFM = require('yaml-fromat');

yamlFM.readString(
`---
key:value
---

Some other contents`
);

# result:
# {
#   "key": "value",
#   "_contents": "\nSome other contents"
# }
```

### Errors

TODO



## `writeString(inputString, inputYaml)`

Returns a Promise that resolves to a string where the YAML front matter has been combined with the input YAML. New data will be appended to the existing front matter. If input string does not contain front matter, a new block of YAML front matter will be added.

This attempts to:
* preserve spaces and comments in the YAML
* maintain the order of existing data

Current limitations, to be addressed:
* when changing data, you can only overwrite the top-level values
* no way to remove keys
* multiple blank lines are collapsed to a single line

TODO: make issues for those ^^


### Examples

TODO: Adding new data

```
const yamlFM = require('yaml-fromat');

yamlFM.writeString('TODO', 'TODO');

# result
# TODO
```

TODO: Changing existing data

```
const yamlFM = require('yaml-fromat');

yamlFM.writeString('TODO', 'TODO');

# result
# TODO
```

