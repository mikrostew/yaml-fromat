const writeString = require('../lib/write-string');
const { expect } = require('chai');

// helpers

function testWriteString(inputString, inputYaml, expectedJson) {
  return writeString(inputString, inputYaml).then((result) => {
    expect(result).to.deep.equal(expectedJson);
  });
}

function testReadStringErrors(inputString, expectedErrMsg) {
  return writeString(inputString)
    .then(() => {
      // TODO: this is not quite right, as this will hit the catch()
      throw new Error('Expected this to fail');
    })
    .catch((e) => {
      expect(e).to.include(expectedErrMsg);
    });
}

// tests

describe('write-string', () => {

  describe('empty string', () => {

    it('key/value', () => {

      return testWriteString(
'',
'foo: bar',
// note the trailing newline
`---
foo: bar
---
`
      );
    });

    // TODO: some of these should be in combine-yaml
    it('comment and key/value 1', () => {

      return testWriteString(
'',
`# comment
foo: bar`,
// note the trailing newline
`---
# comment
foo: bar
---
`
      );
    });

    it('comment and key/value 2', () => {

      return testWriteString(
'',
`foo: bar   # comment`,
// note the trailing newline
`---
foo: bar # comment
---
`
      );
    });

    // TODO: this fails
    it.skip('comment and key/value 3', () => {

      return testWriteString(
'',
`# comment with space

foo: bar`,
// note the trailing newline
`---
# comment
foo: bar
---
`
      );
    });

  });

  // TODO
  // describe('no front matter', () => {
  //   return testWriteString(
// 'no front matter here',
// // TODO: test the contents?
// {
  // _contents: 'no front matter here',
// },
  //   );
  // });

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
  //     return testReadStringErrors(
// `---
// 5
// ---`,
// 'Top level should be an object',
  //     );
  //   });

  //   it('top level boolean', () => {
  //     return testReadStringErrors(
// `---
// true
// ---`,
// 'Top level should be an object',
  //     );
  //   });

  //   it('top level array', () => {
  //     return testReadStringErrors(
// `---
// - a
// - b
// - c
// ---`,
// 'Top level should be an object',
  //     );
  //   });

  //   it('top level string', () => {
  //     return testReadStringErrors(
// `---
// what
// ---`,
// 'Top level should be an object',
  //     );
  //   });

  //   it('malformed yaml', () => {
  //     return testReadStringErrors(
// `---
// oops: [ a, b
// ---`,
// 'Error parsing YAML in front matter',
  //     );
  //   });

  // });

});
