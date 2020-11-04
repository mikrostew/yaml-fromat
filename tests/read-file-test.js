const fs = require('fs');
const readFile = require('../lib/read-file');
const { expect } = require('chai');
const temp = require('temp').track();

// helpers

function testReadFile(inputFileContents, expectedJson) {
  // setup a file with those contents
  const tempFile = temp.openSync();
  fs.writeSync(tempFile.fd, inputFileContents);

  return readFile(tempFile.path).then((result) => {
    expect(result).to.deep.equal(expectedJson);
  });
}

function testReadFileErrors(inputFile, expectedErrMsg) {
  return readFile(inputFile)
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

    it.skip('file no exist', () => {
      return testReadFileErrors(
`---
5
---`,
'Top level should be a key/value map',
      );
    });

    it.skip('top level scalar', () => {
      return testReadFileErrors(
`---
5
---`,
'Top level should be a key/value map',
      );
    });

    it.skip('top level boolean', () => {
      return testReadFileErrors(
`---
true
---`,
'Top level should be a key/value map',
      );
    });

    it.skip('top level array', () => {
      return testReadFileErrors(
`---
- a
- b
- c
---`,
'Top level should be a key/value map',
      );
    });

    it.skip('top level string', () => {
      return testReadFileErrors(
`---
what
---`,
'Top level should be a key/value map',
      );
    });

    it.skip('malformed yaml', () => {
      return testReadFileErrors(
`---
oops: [ a, b
---`,
'Error parsing YAML in front matter',
      );
    });

  });
});
