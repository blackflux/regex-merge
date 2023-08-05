import { expect } from 'chai';
import { describe } from 'node-tdd';
import merge from '../src/index.js';

describe('Testing regex-merge', () => {
  it('Testing simple', () => {
    expect(merge(/a/)).to.deep.equal(/a/);
  });

  it('Testing simple concat', () => {
    expect(merge(/all/, /bees/)).to.deep.equal(/allbees/);
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
    expect(merge('$', /^a$/, { anchor: false })).to.deep.equal(/\$a/);
  });

  it('Testing string concat (add anchor)', () => {
    expect(merge('$', /a/, { anchor: true })).to.deep.equal(/^\$a$/);
  });

  it('Testing flag merging', () => {
    expect(merge(
      // eslint-disable-next-line prefer-regex-literals
      new RegExp('a', 'g'),
      // eslint-disable-next-line prefer-regex-literals
      new RegExp('b', 'i')
    )).to.deep.equal(/ab/gi);
  });

  it('Testing flag overwrite', () => {
    expect(merge(
      // eslint-disable-next-line prefer-regex-literals
      new RegExp('a', 'g'),
      // eslint-disable-next-line prefer-regex-literals
      new RegExp('b', 'i'),
      { flags: 'g' }
    )).to.deep.equal(/ab/g);
  });

  it('Testing Escaped characters must be preserved', () => {
    // eslint-disable-next-line no-useless-escape
    expect(merge(/al\l\(/, /bees/)).to.deep.equal(/al\l\(bees/);
  });

  it('Testing Special characters must be preserved', () => {
    expect(merge(/al.*/, /be(e)+s/)).to.deep.equal(/al.*be(e)+s/);
  });

  it('Testing anchors must be preserved', () => {
    expect(merge(/^all/, /bees$/)).to.deep.equal(/^allbees$/);
  });

  it('Testing anchors not preserved if output is meaningless', () => {
    expect(merge(/^all/, /^bees$/)).to.deep.equal(/^allbees$/);
  });

  it('Testing Flags must be preserved', () => {
    expect(merge(/all/i, /bees/g)).to.deep.equal(/allbees/gi);
  });

  it('Testing Multiple identical flags must be deduplicated', () => {
    expect(merge(/all/g, /bees/g)).to.deep.equal(/allbees/g);
  });

  it('Testing regex-join with strings', () => {
    expect(merge('all', 'bees')).to.deep.equal(/allbees/);
  });

  it('Testing Mixed with strings', () => {
    expect(merge(/all/, 'blue', /bees/)).to.deep.equal(/allbluebees/);
  });

  it('Testing Regex syntax must be escaped in strings', () => {
    // eslint-disable-next-line no-useless-escape
    expect(merge(/al\l\(/, '^(cute.*)^', /bees/)).to.deep.equal(/al\l\(\^\(cute\.\*\)\^bees/);
  });

  it('Testing Strings that look like regex must be escaped', () => {
    expect(merge(/all/, '/cute/', /bees/)).to.deep.equal(/all\/cute\/bees/);
  });

  it('Testing custom1', () => {
    expect(merge(/^beginning/g, / (.+) end/)).to.deep.equal(/^beginning (.+) end/g);
  });

  it('Testing custom2', () => {
    expect(merge('My (last) name is ', /(\w+)/g)).to.deep.equal(/My \(last\) name is (\w+)/g);
  });

  it('Testing or with anchors', () => {
    expect(merge(/^a$/, /|/, /^b$/, {
      stripAnchors: false,
      anchor: false
    })).to.deep.equal(/^a$|^b$/);
  });

  it('Testing escaped not stripped', () => {
    expect(merge('a', /^b\$/, 'c')).to.deep.equal(/^ab\$c/);
  });

  it('Testing escaped escape stripped', () => {
    expect(merge('a', /^b\\$/, 'c')).to.deep.equal(/^ab\\c$/);
  });
});
