'use strict';

const fs = require('fs').promises;
const combineYaml = require('./combine-yaml');

const yamlAndContentsFromStream = require('./yaml-and-contents-from-stream');

// I think this is actually called a "document separator" in YAML?
// https://yaml.org/spec/1.2/spec.html
const FM_SEPARATOR = '---';

// returns a Promise that resolves once the file has been written,
// resolving to the resulting YAML front matter, as JSON
// TODO: option to get the yaml Document instead
function writeFile(filePath, inputYaml /* options */) {

  let readStream;
  try {
    readStream = fs.createReadStream(filePath);
  } catch(err) {
    return Promise.reject(new Error(`Could not open file for reading\n\n${err.message}`));
  }

  return yamlAndContentsFromStream(readStream)
    .then((contents) => {
      const [yamlFMContents, otherContents] = contents;

      // combine and return
      const resultYamlFM = combineYaml(yamlFMContents, inputYaml);
      let stringifiedFM;

      if (resultYamlFM === '') {
        stringifiedFM = [FM_SEPARATOR, FM_SEPARATOR].join('\n');
      } else {
        stringifiedFM = [FM_SEPARATOR, resultYamlFM, FM_SEPARATOR].join('\n');
      }

      // what to write back to the file
      const contentsToWrite = (otherContents === '') ? stringifiedFM : [stringifiedFM, otherContents].join('\n');

      // write the file
      // TODO: optionally write to a different file
      return fs.writeFile(filePath, contentsToWrite);
    });
}

module.exports = writeFile;
