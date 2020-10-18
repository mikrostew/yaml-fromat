'use strict';

const yaml = require('yaml');
const { YAMLMap, YAMLSeq } = require('yaml/types');

// Add some yaml to the initial yaml, returning the resulting yaml string
function combineYaml(initialYaml, inputYaml, options) {
  // TODO: options - what do I need here?
  // * overwrite y/n

  // TODO: pass in key:undefined to delete a key?

  // if the initial yaml ends with newline, preserve that
  // TODO: make this configurable?
  const preserveTrailingNewline = initialYaml.endsWith('\n');

  // using the Document methods, which preserve blank lines and comments
  const initialDoc = yaml.parseDocument(initialYaml);
  if (initialDoc.errors && initialDoc.errors.length !== 0) {
    throw new Error('Error parsing YAML in front matter');
  }

  // if the input is empty, just return the existing YAML
  if (typeof inputYaml === 'string' && inputYaml.trim() === '') {
    return initialYaml;
  }

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
  }

  // add the input yaml to the document

  // try to parse the input YAML
  const inputDoc = yaml.parseDocument(inputYaml);
  if (inputDoc.errors && inputDoc.errors.length !== 0) {
    throw new Error('Error parsing input YAML');
  }

  if (inputDoc.contents === null) {
    // this will be the case for comment-only input
    throw new Error('Input is only comments');
  }

  // this is what should be input in the normal case
  if (inputDoc.contents instanceof YAMLMap) {
    inputDoc.contents.items.forEach((node) => {
      // check if node already exists
      if (initialDoc.has(node.key.value)) {
        // console.log(node);
        initialDoc.set(node.key, node.value);
      } else {
        initialDoc.add(node);
      }
    });
  } else {
    // doesn't make sense to add non-map items at the top level
    throw new Error('Cannot add non-map items at the top level');
  }


  // handle any document comments
  // (replace existing comment)
  if (inputDoc.commentBefore !== null) {
    initialDoc.commentBefore = inputDoc.commentBefore;
  }
  if (inputDoc.comment !== null) {
    initialDoc.comment = inputDoc.comment;
  }

  let stringified = initialDoc.toString();

  if (!preserveTrailingNewline) {
    stringified = stringified.trimEnd();
  }

  return stringified;
}

module.exports = combineYaml;
