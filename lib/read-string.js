'use strict';

const { Readable } = require('stream');
const YAML = require('yaml');
const { YAMLMap } = require('yaml/types');

const yamlAndContentsFromStream = require('./yaml-and-contents-from-stream');

// returns a Promise that resolves to the YAML front matter, as JSON
// TODO: option to get the yaml Document instead
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
        const fmDoc = YAML.parseDocument(yamlFMContents);
        if (fmDoc.errors && fmDoc.errors.length !== 0) {
          // TODO: include the parse error here
          throw new Error(`Error parsing YAML in front matter`);
        }

        // check here that it's a key/value map at top level
        // TODO: dunno if I should care about this?
        if (!(fmDoc.contents instanceof YAMLMap)) {
          throw new Error('Top level should be a key/value map');
        }

        fmYaml = fmDoc.toJSON();
      }

      fmYaml._contents = otherContents;
      return fmYaml;
    });
}

module.exports = readString;
