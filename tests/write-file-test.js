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
function testWriteFileErrors(inputFileContents, inputYaml, expectedErrMsg) {
  // setup a file with those contents, maybe
  let tempFile;
  if (inputFileContents === null) {
    // test file doesn't exist
    tempFile = { path: '/path/to/some/non/existent/file' };
  } else if (inputFileContents === undefined) {
    // test undefined input
    tempFile = undefined;
  } else if (inputFileContents === '[read-only]') {
    // test read-only file
    tempFile = temp.openSync();
    fs.writeFileSync(tempFile.path, inputFileContents);
    // set file mode to read-only
    fs.chmodSync(tempFile.path, 0o400);
  } else {
    tempFile = temp.openSync();
    fs.writeFileSync(tempFile.path, inputFileContents);
  }

  return writeFile(tempFile ? tempFile.path : undefined, inputYaml)
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

    it('non-existent file', () => {
      return testWriteFileErrors(
null,
'',
'Error reading input stream',
      );
    });

    it('undefined input', () => {
      return testWriteFileErrors(
undefined,
'',
'Could not open file for reading',
      );
    });

    it('read-only file', () => {
      return testWriteFileErrors(
'[read-only]',
'',
'Error writing file',
      );
    });

    it('top level scalar', () => {
      return testWriteFileErrors(
`---
foo: bar
---`,
'5',
'Cannot add non-map items at the top level',
      );
    });

    it('malformed yaml', () => {
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
