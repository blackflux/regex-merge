const expect = require('chai').expect;
const merge = require('../src/index');

describe('Testing regex-merge', () => {
  it('Testing simple', () => {
    expect(merge(/a/)).to.deep.equal(/a/);
  });

  it('Testing simple concat', () => {
    expect(merge(/a/, /b/, /c/)).to.deep.equal(/abc/);
  });

  it('Testing anchored concat', () => {
    expect(merge(/^a$/, /^b$/, /^c$/)).to.deep.equal(/^abc$/);
  });

  it('Testing string concat', () => {
    expect(merge('$', /^a$/)).to.deep.equal(/^\$a$/);
    expect(merge('$', /a/)).to.deep.equal(/\$a/);
  });

  it('Testing string concat (strip anchor)', () => {
    expect(merge('$', /^a$/, {
      anchorStart: false,
      anchorEnd: false
    })).to.deep.equal(/\$a/);
  });

  it('Testing string concat (add anchor)', () => {
    expect(merge('$', /a/, {
      anchorStart: true,
      anchorEnd: true
    })).to.deep.equal(/^\$a$/);
  });

  it('Testing flag merging', () => {
    expect(merge(
      new RegExp('a', 'g'),
      new RegExp('b', 'i')
    )).to.deep.equal(/ab/gi);
  });

  it('Testing flag overwrite', () => {
    expect(merge(
      new RegExp('a', 'g'),
      new RegExp('b', 'i'),
      { flags: 'g' }
    )).to.deep.equal(/ab/g);
  });
});
