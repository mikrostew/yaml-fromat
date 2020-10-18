const writeString = require('../lib/write-string');
const { expect } = require('chai');

// helpers

function testWriteString(inputString, inputYaml, expectedJson) {
  return writeString(inputString, inputYaml).then((result) => {
    expect(result).to.deep.equal(expectedJson);
  });
}

function testWriteStringErrors(inputString, expectedErrMsg) {
  return writeString(inputString)
    .then(() => {
      throw new Error('[write-string-errors] Expected this to fail');
    })
    .catch((e) => {
      // re-throw that ^^ error instead of checking the message
      if (e.includes('write-string-errors')) {
        throw e;
      }
      expect(e).to.include(expectedErrMsg);
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

  // TODO
  // it('empty front matter', () => {
  //   return testWriteString(
// `---
// ---`,
// {
  // _contents: '',
// },
  //   );
  // });

  // TODO
  // it('key/value pair', () => {
  //   return testWriteString(
// `---
// foo: bar
// ---`,
// {
  // foo: 'bar',
  // _contents: '',
// },
  //   );
  // });

  // TODO
  // it('complicated stuff', () => {
  //   return testWriteString(
// `---
// foo: bar
// things:
// - a
// - b
// - c
// thing:
  // only: one
// ---`,
// {
  // foo: 'bar',
  // things: [ 'a', 'b', 'c'],
  // thing: { only: 'one' },
  // _contents: '',
// },
  //   );
  // });

  // TODO
  // it('front matter and contents', () => {
  //   return testWriteString(
// `---
// foo: bar
// thing:
  // only: one
// ---
// Here is some text

// OK`,
// {
  // foo: 'bar',
  // thing: { only: 'one' },
  // _contents: 'Here is some text\n\nOK',
// },
  //   );
  // });

  // TODO
  // describe('errors', () => {

  //   it('top level scalar', () => {
  //     return testWriteStringErrors(
// `---
// 5
// ---`,
// 'Top level should be an object',
  //     );
  //   });

  //   it('top level boolean', () => {
  //     return testWriteStringErrors(
// `---
// true
// ---`,
// 'Top level should be an object',
  //     );
  //   });

  //   it('top level array', () => {
  //     return testWriteStringErrors(
// `---
// - a
// - b
// - c
// ---`,
// 'Top level should be an object',
  //     );
  //   });

  //   it('top level string', () => {
  //     return testWriteStringErrors(
// `---
// what
// ---`,
// 'Top level should be an object',
  //     );
  //   });

  //   it('malformed yaml', () => {
  //     return testWriteStringErrors(
// `---
// oops: [ a, b
// ---`,
// 'Error parsing YAML in front matter',
  //     );
  //   });

  // });

});
