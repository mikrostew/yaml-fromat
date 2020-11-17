const fs = require('fs');
const writeFile = require('../lib/write-file');
const { expect } = require('chai');
const temp = require('temp').track();

// helpers

function testWriteFile(inputFileContents, inputYaml, expectedContents) {
  // setup a file with those contents
  const tempFile = temp.openSync();
  fs.writeFileSync(tempFile.path, inputFileContents);

  return writeFile(tempFile.path, inputYaml).then(() => {
    const contents = fs.readFileSync(tempFile.fd, 'utf8');
    expect(contents).to.deep.equal(expectedContents);
  });
}

// TODO
function testWriteFileErrors(inputString, inputYaml, expectedErrMsg) {
  return writeFile(inputString, inputYaml)
    .then(() => {
      throw new Error('[write-file-errors] Expected this to fail');
    })
    .catch((e) => {
      // re-throw that ^^ error instead of checking the message
      if (e.message.includes('write-file-errors')) {
        throw e;
      }
      expect(e.message).to.include(expectedErrMsg);
    });
}

// tests

describe('write-string', () => {

  describe('empty string', () => {

    it('empty input', () => {
      return testWriteFile(
'',
'',
`---
---`
      );
    });

    it('key/value', () => {
      return testWriteFile(
'',
'foo: bar',
`---
foo: bar
---`
      );
    });

    it('comment and key/value', () => {
      return testWriteFile(
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

      return testWriteFile(
'No front matter here',
'foo: bar',
`---
foo: bar
---
No front matter here`,
      );
    });

    it('initial newline', () => {

      return testWriteFile(
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
      return testWriteFile(
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
      return testWriteFile(
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
      return testWriteFile(
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

    // TODO
    it.skip('top level scalar', () => {
      return testWriteFileErrors(
`---
foo: bar
---`,
'5',
'Cannot add non-map items at the top level',
      );
    });

    // TODO
    it.skip('malformed yaml', () => {
      return testWriteFileErrors(
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
