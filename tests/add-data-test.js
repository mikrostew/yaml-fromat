const addData = require('../lib/add-data');
const expect = require('chai').expect;

describe('add-data', () => {

  describe('empty input', () => {
    it('single key/value pair', () => {
      const input = '';
      const data = { key: 'value' };
      const expected = 'key: value';
      expect(addData(input, data)).to.equal(expected);
    });

    it('multiple key/value pairs', () => {
      const input = '';
      const data = { key: 'value', foo: 'bar' };
      const expected = 'key: value\nfoo: bar';
      expect(addData(input, data)).to.equal(expected);
    });

    it('complicated input', () => {
      const input = '';
      const data = {
        key: 'value',
        array: [ 'a', 'b', 'c' ],
        foo: {
          bar: 'baz',
        }
      };
      const expected = 'key: value\narray:\n  - a\n  - b\n  - c\nfoo:\n  bar: baz';
      expect(addData(input, data)).to.equal(expected);
    });
  });

  describe('comments in input', () => {
    it('comment only', () => {
      const input = '# comment';
      const data = { key: 'value' };
      // Note that there is an extra blank line here
      const expected = '# comment\n\nkey: value';
      expect(addData(input, data)).to.equal(expected);
    });

    it('comment at the beginning', () => {
      const input = '# comment\nfoo: bar';
      const data = { key: 'value' };
      const expected = '# comment\nfoo: bar\nkey: value';
      expect(addData(input, data)).to.equal(expected);
    });

    // TODO: fails
    it('comment at the end 1', () => {
      const input = 'foo: bar\n# comment';
      const data = { key: 'value' };
      const expected = 'foo: bar\n# comment\nkey: value';
      expect(addData(input, data)).to.equal(expected);
    });

    // TODO: fails
    it('comment at the end 2', () => {
      const input = 'foo: bar\n\n# comment';
      const data = { key: 'value' };
      const expected = 'foo: bar\n\n# comment\nkey: value';
      expect(addData(input, data)).to.equal(expected);
    });


  });

  // TODO: preserving blank lines in the file
  // TODO: overwrite y/n
  // TODO: how to input comments?

  describe('errors', () => {
    it('adding empty object', () => {
      const input = '';
      const data = {};
      expect(() => addData(input, data)).to.throw();
    });

    it('adding an array', () => {
      const input = '';
      const data = [ 'a', 'b', 'c' ];
      expect(() => addData(input, data)).to.throw("Can't add array at the top level");
    });

    it('adding a scalar', () => {
      const input = '';
      const data = 4;
      expect(() => addData(input, data)).to.throw();
    });

    it('adding a boolean', () => {
      const input = '';
      const data = false;
      expect(() => addData(input, data)).to.throw();
    });

  });

});
