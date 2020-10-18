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

    it('empty input', () => {
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

    it('input with document comment 1', () => {
      return testCombineYaml(
'',
`# doc comment

foo: bar`,
`# doc comment

foo: bar`,
      );
    });

    it('input with document comment 2', () => {
      return testCombineYaml(
'',
`foo: bar

# doc comment`,
`foo: bar

# doc comment`,
      );
    });

    it('input with document comment 3', () => {
      return testCombineYaml(
'# existing comment',
`# doc comment

foo: bar`,
`# doc comment

foo: bar`,
      );
    });

    it('input with document comment 4', () => {
      return testCombineYaml(
'# existing comment',
`foo: bar

# doc comment`,
`# existing comment

foo: bar

# doc comment`,
      );
    });

  });

  describe('replacing values', () => {

    it('replace key/value', () => {
      return testCombineYaml(
'foo: bar',
'foo: baz',
'foo: baz',
      );
    });

    it('replace with different type', () => {
      return testCombineYaml(
'foo: bar',
`foo:
  - a
  - b
`,
`foo:
  - a
  - b`,
      );
    });

    // TODO: more tests here

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

    it('comment on same line 2', () => {
      return testCombineYaml(
`foo: bar   # comment`,
'foo: baz',
'foo: baz',
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

  describe('preserving blank lines', () => {

    it('single blank line 1', () => {
      return testCombineYaml(
`# some first thing
foo: bar

# another thing
some: thing`,
'key: value',
`# some first thing
foo: bar

# another thing
some: thing
key: value`,
      );
    });

    it('single blank line 2', () => {
      return testCombineYaml(
`# some first thing
foo: bar

# another thing
some: thing`,
'foo: foo',
`# some first thing
foo: foo

# another thing
some: thing`,
      );
    });

    it('single blank line 3', () => {
      return testCombineYaml(
`# some first thing
foo: bar

# another thing
some: thing`,
'some: rum',
`# some first thing
foo: bar

# another thing
some: rum`,
      );
    });

    it('multiple blank lines', () => {
      return testCombineYaml(
`# some first thing
foo: bar


# another thing
some: thing`,
'key: value',
`# some first thing
foo: bar

# another thing
some: thing
key: value`,
      );
    });

    it('final newline', () => {
      return testCombineYaml(
`# some first thing
foo: bar

# another thing
some: thing
`,
'key: value',
`# some first thing
foo: bar

# another thing
some: thing
key: value
`,
      );
    });

  });

  // TODO: overwrite y/n
  describe('overwrite option', () => {});

  // TODO
  describe('detecting indentation', () => {});

  describe('errors', () => {
    it('adding an array', () => {
      return testCombineYamlErrors('', '- a\n- b\n- c', 'Cannot add non-map items at the top level');
    });

    it('adding a scalar', () => {
      return testCombineYamlErrors('', '4', 'Cannot add non-map items at the top level');
    });

    it('adding a boolean', () => {
      return testCombineYamlErrors('', 'false', 'Cannot add non-map items at the top level');
    });

    it('adding a comment only', () => {
      return testCombineYamlErrors('', '# some comment', 'Input is only comments');
    });

    it('malformed front matter', () => {
      return testCombineYamlErrors(
`---
oops:
  - a
  b
---`,
'',
'Error parsing YAML in front matter'
      );
    });

    it('malformed input yaml', () => {
      return testCombineYamlErrors(
'',
`oops: [ a, b`,
'Error parsing input YAML'
      );
    });

  });

});
