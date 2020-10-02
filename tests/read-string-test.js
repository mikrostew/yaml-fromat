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
      // TODO: this is not quite right, as this will hit the catch()
      throw new Error('Expected this to fail');
    })
    .catch((e) => {
      expect(e).to.equal(expectedErrMsg);
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
// TODO: test the contents?
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

  describe('errors', () => {

    it('top level scalar', () => {
      return testReadStringErrors(
`---
5
---`,
'Top level should be an object',
      );
    });

    it('top level boolean', () => {
      return testReadStringErrors(
`---
true
---`,
'Top level should be an object',
      );
    });

    it('top level array', () => {
      return testReadStringErrors(
`---
- a
- b
- c
---`,
'Top level should be an object',
      );
    });

  });
});
