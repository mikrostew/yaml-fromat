const addYaml = require('../lib/add-yaml');
const expect = require('chai').expect;

// helpers

function testAddYaml(initialYaml, inputYaml, expectedYaml) {
  expect(addYaml(initialYaml, inputYaml)).to.equal(expectedYaml);
}

function testAddYamlErrors(initialYaml, inputYaml, expectedErrMsg) {
  expect(() => addYaml(initialYaml, inputYaml)).to.throw(expectedErrMsg);
}


// tests

describe('add-data', () => {

  describe('empty initial yaml', () => {
    it('single key/value pair', () => {
      testAddYaml(
'',

'key: value',

'key: value',
      );
    });

    it('multiple key/value pairs', () => {
      testAddYaml(
'',

`key: value
foo: bar`,

`key: value
foo: bar`,
      );
    });

    it('complicated input', () => {
      testAddYaml(
'',

`key: value
array:
- a
- b
- c
foo:
  bar: baz`,

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

  describe('comments in initial yaml', () => {
    it('comment only is a document commentBefore', () => {
      testAddYaml(
'# comment',

'key: value',

// Note that there is an extra blank line here
`# comment

key: value`,
      );
    });

    it('comment at the beginning is a node commentBefore', () => {
      testAddYaml(
`# comment
foo: bar`,

'key: value',

`# comment
foo: bar
key: value`,
      );
    });

    it('comment at the end is a document comment 1', () => {
      testAddYaml(
`foo: bar
# comment`,

'key: value',

`foo: bar
key: value

# comment`,
      );
    });

    it('comment at the end is a document comment 2', () => {
      testAddYaml(
`foo: bar

# comment`,

'key: value',

`foo: bar
key: value

# comment`,
      );
    });

  });

  // TODO: preserving blank lines in the file
  // TODO: overwrite y/n
  // TODO: input comments

  describe('errors', () => {
    it('adding empty yaml', () => {
      testAddYamlErrors('', '', "Empty input");
    });

    it('adding an array', () => {
      testAddYamlErrors('', '- a\n- b\n- c', "Can't add array at the top level");
    });

    it('adding a scalar', () => {
      testAddYamlErrors('', 4, "Could not parse input YAML");
    });

    it('adding a boolean', () => {
      testAddYamlErrors('', false, "Could not parse input YAML");
    });

  });

});
