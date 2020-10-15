const combineYaml = require('../lib/combine-yaml');
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

    // TODO: fix this one
    it.skip('empty input', () => {
      return testCombineYaml(
'',
'',
'',
      );
    });

    it('single key/value pair', () => {
      return testCombineYaml(
'',
'key: value',
'key: value',
      );
    });

    it('multiple key/value pairs', () => {
      return testCombineYaml(
'',
`key: value
foo: bar`,
`key: value
foo: bar`,
      );
    });

    // TODO: fix this one
    it.skip('comment only', () => {
      return testCombineYaml(
'',
'# a comment',
'# a comment',
      );
    });

    it('complicated input', () => {
      return testCombineYaml(
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

    it('input with node comment', () => {
      return testCombineYaml(
'',
`# node comment
foo: bar`,
`# node comment
foo: bar`,
      );
    });

    it('input with same line comment', () => {
      return testCombineYaml(
'',
'foo: bar   # line comment',
'foo: bar # line comment',
      );
    });

    // TODO: fix this
    it.skip('input with document comment 1', () => {
      return testCombineYaml(
'',
`# doc comment

foo: bar`,
`# doc comment

foo: bar`,
      );
    });

    // TODO: fix this
    it.skip('input with document comment 2', () => {
      return testCombineYaml(
'',
`foo: bar

# doc comment`,
`foo: bar

# doc comment`,
      );
    });

  });

  // TODO: kinda important, and this doesn't work
  describe('replacing values', () => {

    it.skip('replace key/value', () => {
      return testCombineYaml(
'foo: bar',
'foo: baz',
'foo: baz',
      );
    });

  });

  describe('comments in initial yaml', () => {

    it('comment only is a document commentBefore', () => {
      return testCombineYaml(
'# comment',
'key: value',
// Note the extra blank line
`# comment

key: value`,
      );
    });

    it('comment at the beginning is a node commentBefore', () => {
      return testCombineYaml(
`# comment
foo: bar`,
'key: value',
`# comment
foo: bar
key: value`,
      );
    });

    it('comment on same line 1', () => {
      return testCombineYaml(
`foo: bar   # comment`,
'key: value',
`foo: bar # comment
key: value`,
      );
    });

    // TODO: fix this
    it.skip('comment on same line 2', () => {
      return testCombineYaml(
`foo: bar   # comment`,
'foo: baz',
'foo: baz # comment',
      );
    });

    it('comment at the end is a document comment 1', () => {
      return testCombineYaml(
`foo: bar
# comment`,
'key: value',
`foo: bar
key: value

# comment`,
      );
    });

    it('comment at the end is a document comment 2', () => {
      return testCombineYaml(
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
  describe('preserving blank lines', () => {});

  // TODO: overwrite y/n
  describe('overwrite option', () => {});

  // TODO
  describe('detecting indentation', () => {});

  describe('errors', () => {
    it('adding an array', () => {
      return testCombineYamlErrors('', '- a\n- b\n- c', "Can't add array at the top level");
    });

    it('adding a scalar', () => {
      return testCombineYamlErrors('', 4, "Could not parse input YAML");
    });

    it('adding a boolean', () => {
      return testCombineYamlErrors('', false, "Could not parse input YAML");
    });

  });

});
