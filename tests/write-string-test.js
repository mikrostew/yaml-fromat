const writeString = require('../lib/write-string');
const { expect } = require('chai');

// helpers

function testWriteString(inputString, inputYaml, expectedJson) {
  return writeString(inputString, inputYaml).then((result) => {
    expect(result).to.deep.equal(expectedJson);
  });
}

function testWriteStringErrors(inputString, inputYaml, expectedErrMsg) {
  return writeString(inputString, inputYaml)
    .then(() => {
      throw new Error('[write-string-errors] Expected this to fail');
    })
    .catch((e) => {
      // re-throw that ^^ error instead of checking the message
      if (e.message.includes('write-string-errors')) {
        throw e;
      }
      expect(e.message).to.include(expectedErrMsg);
    });
}

// tests

describe('write-string', () => {

  describe('empty string', () => {

    it('empty input', () => {
      return testWriteString(
'',
'',
`---
---`
      );
    });

    it('key/value', () => {
      return testWriteString(
'',
'foo: bar',
`---
foo: bar
---`
      );
    });

    it('comment and key/value', () => {
      return testWriteString(
'',
`# comment
foo: bar`,
`---
# comment
foo: bar
---`
      );
    });

  });

  describe('no front matter', () => {

    it('single line of contents', () => {

      return testWriteString(
'No front matter here',
'foo: bar',
`---
foo: bar
---
No front matter here`,
      );
    });

    it('initial newline', () => {

      return testWriteString(
`
No front matter here`,
'foo: bar',
`---
foo: bar
---

No front matter here`,
      );
    });

  });

  describe('front matter and contents', () => {

    it('empty input', () => {
      return testWriteString(
`---
foo: bar
---
Some contents`,
'',
`---
foo: bar
---
Some contents`,
      );
    });

    it('new data', () => {
      return testWriteString(
`---
foo: bar
---
Some contents`,
'key: value',
`---
foo: bar
key: value
---
Some contents`,
      );
    });

    it('change data', () => {
      return testWriteString(
`---
foo: bar
# goign to change this
key: value
---
Some contents`,
'key: new value',
`---
foo: bar
# goign to change this
key: new value
---
Some contents`,
      );
    });

  });


  describe('errors', () => {

    it('top level scalar', () => {
      return testWriteStringErrors(
`---
foo: bar
---`,
'5',
'Cannot add non-map items at the top level',
      );
    });

    it('malformed yaml', () => {
      return testWriteStringErrors(
`---
oops:
  - one
  two
---`,
'',
'Error parsing YAML in front matter',
      );
    });

  });

});
