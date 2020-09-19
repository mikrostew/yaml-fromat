'use strict';

const yaml = require('yaml');

// add some data to the input yaml, and return a string with that data
function addData(yamlString, dataToAdd, options) {
  // TODO: options - what do I need here?
  // * overwrite y/n

  // if the input ends with newline, preserve that
  // TODO: make this configurable?
  const preserveTrailingNewline = yamlString.endsWith('\n');

  // using the Document methods, which preserve blank lines
  const doc = yaml.parseDocument(yamlString);

  // add the input data to the document
  if (Array.isArray(dataToAdd)) {
    // doesn't make sense to allow adding array contents with no key
    // TODO: better message, need CTA here
    throw new Error("Can't add array at the top level");
  } else {
    // assume an object
    // TODO: probably need an error for non-objects (scalar, bool, etc.)
    Object.keys(dataToAdd).forEach((key) => {
      // add the data to the doc
      // TODO: what if I don't want to overwrite?
      doc.set(key, dataToAdd[key]);
    });
  }

  let stringified = doc.toString();

  if (!preserveTrailingNewline) {
    stringified = stringified.trimEnd();
  }

  return stringified;
}

module.exports = addData;
