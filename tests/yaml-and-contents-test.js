const yamlAndContentsFromStream = require('../lib/yaml-and-contents-from-stream');
const { expect } = require('chai');
const { Readable } = require('stream');

// helpers

function testReadFromString(inputString, expectedJson) {
  const readStream = Readable.from(inputString);

  return yamlAndContentsFromStream(readStream).then((result) => {
    expect(result).to.deep.equal(expectedJson);
  });
}

function testReadFromStringErrors(inputString, expectedErrMsg) {
  const readStream = Readable.from(inputString);

  return yamlAndContentsFromStream(readStream)
    .then(() => {
      throw new Error('[yaml-and-contents-errors] Expected this to fail');
    })
    .catch((e) => {
      // re-throw that ^^ error instead of checking the message
      if (e.message.includes('yaml-and-contents-errors')) {
        throw e;
      }
      expect(e.message).to.include(expectedErrMsg);
    });
}

// tests

describe('yaml-and-contents-from-stream', () => {

  it('empty string', () => {
    return testReadFromString(
'',
[ '', '' ],
    );
  });

  it('empty front matter', () => {
    return testReadFromString(
`---
---`,
[ '', '' ],
    );
  });

  it('front matter only', () => {
    return testReadFromString(
`---
key: value
---`,
[ 'key: value', '' ],
    );
  });

  it('no front matter', () => {
    return testReadFromString(
'Contents only',
[ '', 'Contents only' ],
    );
  });

  it('front matter and contents', () => {
    return testReadFromString(
`---
key: value
---

Contents`,
[ 'key: value', '\nContents' ],
    );
  });

  it('front matter not on first line', () => {
    return testReadFromString(
`
---
key: value
---

Contents`,
[ '', '\n---\nkey: value\n---\n\nContents' ],
    );
  });

  // TODO: files too

  describe('errors', () => {

    it('non-terminating front matter', () => {
      return testReadFromStringErrors(
`---
key: value

Contents`,
'Non-terminated YAML front matter',
      );
    });

  });

});
