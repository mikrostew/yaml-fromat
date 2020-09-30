const combineYaml = require('../lib/add-yaml');
const { expect } = require('chai');

// helpers

function testCombineYaml(initialYaml, inputYaml, expectedYaml) {
  expect(combineYaml(initialYaml, inputYaml)).to.equal(expectedYaml);
}

function testCombineYamlErrors(initialYaml, inputYaml, expectedErrMsg) {
  expect(() => combineYaml(initialYaml, inputYaml)).to.throw(expectedErrMsg);
}


// tests

describe('combine-yaml', () => {

  describe('empty initial yaml', () => {
    it('single key/value pair', () => {
      testCombineYaml(
'',

'key: value',

'key: value',
      );
    });

    it('multiple key/value pairs', () => {
      testCombineYaml(
'',

`key: value
foo: bar`,

`key: value
foo: bar`,
      );
    });

    it('complicated input', () => {
      testCombineYaml(
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
      testCombineYaml(
'# comment',

'key: value',

// Note that there is an extra blank line here
`# comment

key: value`,
      );
    });

    it('comment at the beginning is a node commentBefore', () => {
      testCombineYaml(
`# comment
foo: bar`,

'key: value',

`# comment
foo: bar
key: value`,
      );
    });

    it('comment at the end is a document comment 1', () => {
      testCombineYaml(
`foo: bar
# comment`,

'key: value',

`foo: bar
key: value

# comment`,
      );
    });

    it('comment at the end is a document comment 2', () => {
      testCombineYaml(
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
      testCombineYamlErrors('', '', "Empty input");
    });

    it('adding an array', () => {
      testCombineYamlErrors('', '- a\n- b\n- c', "Can't add array at the top level");
    });

    it('adding a scalar', () => {
      testCombineYamlErrors('', 4, "Could not parse input YAML");
    });

    it('adding a boolean', () => {
      testCombineYamlErrors('', false, "Could not parse input YAML");
    });

  });

});
