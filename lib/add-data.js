'use strict';

const yaml = require('yaml');

// add some data to the input yaml, and return a string with that data
function addData(yamlString, dataToAdd, options) {
  // TODO: options - what do I need here?
  // * overwrite y/n

  // using the Document methods, which preserve blank lines
  const doc = yaml.parseDocument(yamlString);

  // add the input data to the document
  if (Array.isArray(dataToAdd)) {
    // I think I can just do this for arrays?
    doc.add(dataToAdd);
  } else {
    // assume an object
    Object.keys(dataToAdd).forEach((key) => {
      // add the data to the doc
      // TODO: what if I don't want to overwrite?
      doc.set(key, dataToAdd[key]);
    });
  }

  return doc.toString();
}


// TODO - add real tests

const testOne = `one: 1
two: 2
three: 3`;
console.log("Test 1");
console.log('---');
console.log(testOne);
console.log('---');
console.log('');
console.log(addData(testOne, { four: 4 }));

const testTwo = `one: 1
two: 2
three: 3`;
console.log("Test 2");
console.log('---');
console.log(testTwo);
console.log('---');
console.log('');
console.log(addData(testTwo, { two: 4 }));

// blank lines are preserved :)
const testThree = `one: 1

two: 2

three: 3`;
console.log("Test 3");
console.log('---');
console.log(testThree);
console.log('---');
console.log('');
console.log(addData(testThree, { four: 4 }));
