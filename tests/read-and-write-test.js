const { readString, writeString } = require('..');
const { expect } = require('chai');

// helpers

function testWriteAndReadString(inputString, yamlToWrite, expectedJson) {
  return writeString(inputString, yamlToWrite)
    .then((writeResult) => readString(writeResult))
    .then((readResult) => {
      expect(readResult).to.deep.equal(expectedJson);
    });
}

// tests

describe('write and read strings', () => {

  it('empty', () => {
    return testWriteAndReadString(
'',
'',
{
  _contents: '',
},
    );
  });

  it('write key/value with contents', () => {
    return testWriteAndReadString(
'Some contents',
'foo: bar',
{
  foo: 'bar',
  _contents: 'Some contents',
},
    );
  });

  it('replace key/value with contents', () => {
    return testWriteAndReadString(
`---
foo: bar
---

more contents`,
'foo: baz',
{
  foo: 'baz',
  _contents: '\nmore contents',
},
    );
  });

});
