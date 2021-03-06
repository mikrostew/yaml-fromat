const readString = require('../lib/read-string');
const { expect } = require('chai');

// helpers

function testReadString(inputString, expectedJson) {
  return readString(inputString).then((result) => {
    expect(result).to.deep.equal(expectedJson);
  });
}

function testReadStringErrors(inputString, expectedErrMsg) {
  return readString(inputString)
    .then(() => {
      throw new Error('[read-string-errors] Expected this to fail');
    })
    .catch((e) => {
      // re-throw that ^^ error instead of checking the message
      if (e.message.includes('read-string-errors')) {
        throw e;
      }
      expect(e.message).to.include(expectedErrMsg);
    });
}

// tests

describe('read-string', () => {

  it('empty string', () => {
    return testReadString(
'',
{
  _contents: '',
},
    );
  });

  it('no front matter', () => {
    return testReadString(
'no front matter here',
{
  _contents: 'no front matter here',
},
    );
  });

  it('empty front matter', () => {
    return testReadString(
`---
---`,
{
  _contents: '',
},
    );
  });

  it('key/value pair', () => {
    return testReadString(
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
    return testReadString(
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
    return testReadString(
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

    it('missing argument', () => {
      return testReadStringErrors(
undefined,
'Expected input type string',
      );
    });

    it('wrong argument type', () => {
      return testReadStringErrors(
[1, 2, 3, 4],
'Expected input type string',
      );
    });

    it('top level scalar', () => {
      return testReadStringErrors(
`---
5
---`,
'Top level should be a key/value map',
      );
    });

    it('top level boolean', () => {
      return testReadStringErrors(
`---
true
---`,
'Top level should be a key/value map',
      );
    });

    it('top level array', () => {
      return testReadStringErrors(
`---
- a
- b
- c
---`,
'Top level should be a key/value map',
      );
    });

    it('top level string', () => {
      return testReadStringErrors(
`---
what
---`,
'Top level should be a key/value map',
      );
    });

    it('malformed yaml', () => {
      return testReadStringErrors(
`---
oops: [ a, b
---`,
'Error parsing YAML in front matter',
      );
    });

  });
});
