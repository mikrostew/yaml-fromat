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

  // TODO: these put the comment at the end
  describe('comment in input', () => {
    it.skip('empty data --> empty output', () => {
      const input = '# comment';
      const data = {};
      const expected = '';
      expect(addData(input, data)).to.equal(expected);
    });

    it.skip('single key/value pair', () => {
      const input = '# comment';
      const data = { key: 'value' };
      const expected = '# comment\nkey: value';
      expect(addData(input, data)).to.equal(expected);
    });

    it.skip('multiple key/value pairs', () => {
      const input = '# comment';
      const data = { key: 'value', foo: 'bar' };
      const expected = 'key: value\nfoo: bar';
      expect(addData(input, data)).to.equal(expected);
    });

    it.skip('complicated input', () => {
      const input = '# comment';
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

  // TODO: preserving blank lines in the input
  // TODO: overwrite y/n

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
