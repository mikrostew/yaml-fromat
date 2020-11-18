const fs = require('fs');
const readFile = require('../lib/read-file');
const { expect } = require('chai');
const temp = require('temp').track();

// helpers

function testReadFile(inputFileContents, expectedJson) {
  // setup a file with those contents
  const tempFile = temp.openSync();
  fs.writeFileSync(tempFile.path, inputFileContents);

  return readFile(tempFile.path).then((result) => {
    expect(result).to.deep.equal(expectedJson);
  });
}

function testReadFileErrors(inputFileContents, expectedErrMsg) {
  // setup a file with those contents, maybe
  let tempFile;
  if (inputFileContents === null) {
    // test file doesn't exist
    tempFile = { path: '/path/to/some/non/existent/file' };
  } else if (inputFileContents === undefined) {
    // test undefined input
    tempFile = undefined;
  } else {
    tempFile = temp.openSync();
    fs.writeFileSync(tempFile.path, inputFileContents);
  }

  return readFile(tempFile ? tempFile.path : undefined)
    .then(() => {
      throw new Error('[read-file-errors] Expected this to fail');
    })
    .catch((e) => {
      // re-throw that ^^ error instead of checking the message
      if (e.message.includes('read-file-errors')) {
        throw e;
      }
      expect(e.message).to.include(expectedErrMsg);
    });
}

// tests

describe('read-file', () => {

  it('empty file', () => {
    return testReadFile(
'',
{
  _contents: '',
},
    );
  });

  it('no front matter', () => {
    return testReadFile(
'no front matter here',
{
  _contents: 'no front matter here',
},
    );
  });

  it('empty front matter', () => {
    return testReadFile(
`---
---`,
{
  _contents: '',
},
    );
  });

  it('key/value pair', () => {
    return testReadFile(
`---
foo: bar
---`,
{
  foo: 'bar',
  _contents: '',
},
    );
  });

  it('complicated stuff', () => {
    return testReadFile(
`---
foo: bar
things:
- a
- b
- c
thing:
  only: one
---`,
{
  foo: 'bar',
  things: [ 'a', 'b', 'c'],
  thing: { only: 'one' },
  _contents: '',
},
    );
  });

  it('front matter and contents', () => {
    return testReadFile(
`---
foo: bar
thing:
  only: one
---
Here is some text

OK`,
{
  foo: 'bar',
  thing: { only: 'one' },
  _contents: 'Here is some text\n\nOK',
},
    );
  });

  describe('errors', () => {

    it('non-existent file', () => {
      return testReadFileErrors(
null,
'Error reading input stream',
      );
    });

    it('undefined input', () => {
      return testReadFileErrors(
undefined,
'Could not open file for reading',
      );
    });

    it('top level scalar', () => {
      return testReadFileErrors(
`---
5
---`,
'Top level should be a key/value map',
      );
    });

    it('top level boolean', () => {
      return testReadFileErrors(
`---
true
---`,
'Top level should be a key/value map',
      );
    });

    it('top level array', () => {
      return testReadFileErrors(
`---
- a
- b
- c
---`,
'Top level should be a key/value map',
      );
    });

    it('top level string', () => {
      return testReadFileErrors(
`---
what
---`,
'Top level should be a key/value map',
      );
    });

    it('malformed yaml', () => {
      return testReadFileErrors(
`---
oops: [ a, b
---`,
'Error parsing YAML in front matter',
      );
    });

  });
});
