'use strict';

const { Readable } = require('stream');
const readline = require('readline');
const YAML = require('yaml');
const { YAMLMap } = require('yaml/types');

const combineYaml = require('./combine-yaml');
const yamlAndContentsFromStream = require('./yaml-and-contents-from-stream');

// I think this is actually called a "document separator" in YAML?
// https://yaml.org/spec/1.2/spec.html
const FM_SEPARATOR = '---';

// returns a Promise that resolves to:
// a string where the YAML front matter has been combined with the input YAML
function writeString(inputString, inputYaml, _options) {

  // need this check for node 10.x
  const readStream = (inputString === '') ? Readable.from('\n') : Readable.from(inputString);

  return yamlAndContentsFromStream(readStream)
    .then((contents) => {
      const [yamlFMContents, otherContents] = contents;

      // combine and return
      const resultYamlFM = combineYaml(yamlFMContents, inputYaml);
      return [FM_SEPARATOR, resultYamlFM, FM_SEPARATOR, otherContents].join('\n');
    });
}

module.exports = writeString;
