'use strict';

const { Readable } = require("stream");
const YAML = require('yaml');
const yamlAndContentsFromStream = require('./yaml-and-contents-from-stream');

// returns a Promise that resolves to the YAML front matter, as JSON
function readString(string) {

  // need this check for node 10.x
  const readStream = (string === '') ? Readable.from('\n') : Readable.from(string);

  return yamlAndContentsFromStream(readStream)
    .then((contents) => {
      const [yamlFMContents, otherContents] = contents;

      // store the parsed front matter contents here
      let fmYaml = {};

      // don't parse empty front matter
      if (yamlFMContents.length !== 0) {
        try {
          fmYaml = YAML.parse(yamlFMContents);
        } catch(err) {
          throw new Error(`Error parsing YAML in front matter\n\n${err.message}`);
        }

        // check here the it's an object of key/value at top level
        if (typeof fmYaml === null || Array.isArray(fmYaml) || typeof fmYaml !== 'object') {
          throw new Error('Top level should be an object');
        }
      }

      fmYaml._contents = otherContents;
      return fmYaml;
    });
}

module.exports = readString;
