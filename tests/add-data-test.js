const addData = require('../lib/add-data');
const expect = require('chai').expect;

// helpers

function testAddData(initialYaml, inputYaml, expectedYaml) {
  expect(addData(initialYaml, inputYaml)).to.equal(expectedYaml);
}

function testAddDataErrors(initialYaml, inputYaml, expectedErrMsg) {
  expect(() => addData(initialYaml, inputYaml)).to.throw(expectedErrMsg);
}


// tests

describe('add-data', () => {

  describe('empty input', () => {
    it('single key/value pair', () => {
      testAddData(
'',

{ key: 'value' },

'key: value',
      );
    });

    it('multiple key/value pairs', () => {
      testAddData(
'',

{ key: 'value', foo: 'bar' },

`key: value
foo: bar`,
      );
    });

    it('complicated input', () => {
      testAddData(
'',

{
  key: 'value',
  array: [ 'a', 'b', 'c' ],
  foo: {
    bar: 'baz',
  }
},

`key: value
array:
  - a
  - b
  - c
foo:
  bar: baz`,
      );
    });
  });

  describe('comments in input', () => {
    it('comment only is a document commentBefore', () => {
      testAddData(
'# comment',

{ key: 'value' },

// Note that there is an extra blank line here
`# comment

key: value`,
      );
    });

    it('comment at the beginning is a node commentBefore', () => {
      testAddData(
`# comment
foo: bar`,

{ key: 'value' },

`# comment
foo: bar
key: value`,
      );
    });

    it('comment at the end is a document comment 1', () => {
      testAddData(
`foo: bar
# comment`,

{ key: 'value' },

`foo: bar
key: value

# comment`,
      );
    });

    it('comment at the end is a document comment 2', () => {
      testAddData(
`foo: bar

# comment`,

{ key: 'value' },

`foo: bar
key: value

# comment`,
    );
    });

  });

  // TODO: preserving blank lines in the file
  // TODO: overwrite y/n
  // TODO: how to input comments?

  describe('errors', () => {
    it('adding empty object', () => {
      testAddDataErrors('', {}, "Empty object, or not an object");
    });

    it('adding an array', () => {
      testAddDataErrors('', [ 'a', 'b', 'c' ], "Can't add array at the top level");
    });

    it('adding a scalar', () => {
      testAddDataErrors('', 4, "Empty object, or not an object");
    });

    it('adding a boolean', () => {
      testAddDataErrors('', false, "Empty object, or not an object");
    });

  });

});
