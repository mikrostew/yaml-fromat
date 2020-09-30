'use strict';

const yaml = require('yaml');
const { YAMLMap, YAMLSeq } = require('yaml/types');

// Add some yaml to the initial yaml, returning the resulting yaml string
function combineYaml(initialYaml, inputYaml, options) {
  // TODO: options - what do I need here?
  // * overwrite y/n

  // if the initial yaml ends with newline, preserve that
  // TODO: make this configurable?
  const preserveTrailingNewline = initialYaml.endsWith('\n');

  // using the Document methods, which preserve blank lines and comments
  const initialDoc = yaml.parseDocument(initialYaml);

  // if there is only a comment, then ensure it will come before other things
  // (see https://eemeli.org/yaml/#comments)
  // TODO: make this configurable?
  if (initialDoc.contents === null && initialDoc.comment !== null && initialDoc.commentBefore === null) {
    initialDoc.commentBefore = initialDoc.comment;
    initialDoc.comment = null;
  }

  // if the initial document is empty, initialize it to a map
  // TODO: does this work with comments?
  if (initialDoc.contents === null) {
    initialDoc.contents = new YAMLMap();
    // const setup = initialDoc.createNode({});
  }

  // add the input yaml to the document

  // try to parse the input YAML
  let inputDoc;
  try {
    inputDoc = yaml.parseDocument(inputYaml);
  } catch(err) {
    // console.log(err);
    throw new Error('Could not parse input YAML');
  }

  if (inputDoc.contents === null) {
    // TODO: will this be the case for comment-only input?
    throw new Error('Empty input');
  }

  // doesn't make sense to add an array at the top level
  if (inputDoc.contents instanceof YAMLSeq) {
    throw new Error("Can't add array at the top level");
  }

  // this is what should be input in the normal case
  if (inputDoc.contents instanceof YAMLMap) {
    // console.log(inputDoc.contents.items);
    inputDoc.contents.items.forEach((node) => {
      // TODO: add or set here?
      initialDoc.add(node);
    });
  }

  let stringified = initialDoc.toString();

  if (!preserveTrailingNewline) {
    stringified = stringified.trimEnd();
  }

  return stringified;
}

module.exports = combineYaml;
