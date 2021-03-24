module.exports = (...args) => {
  const hasOptions = (!!args[args.length - 1]) && (args[args.length - 1].constructor === Object);
  const opts = {
    anchorStart: null,
    anchorEnd: null,
    flags: null,
    ...(hasOptions ? args.pop() : {})
  };

  const flags = [];
  const result = [];

  for (let idx = 0, len = args.length; idx < len; idx += 1) {
    const arg = args[idx];
    if (arg instanceof RegExp) {
      flags.push(...arg.flags);
      const { source } = arg;
      const anchoredStart = source[0] === '^';
      const anchoredEnd = source[source.length - 1] === '$';
      if (anchoredStart && opts.anchorStart === null) {
        opts.anchorStart = true;
      }
      if (anchoredEnd && opts.anchorEnd === null) {
        opts.anchorEnd = true;
      }
      result.push(source.slice(anchoredStart ? 1 : 0, anchoredEnd ? -1 : undefined));
    } else {
      result.push(arg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    }
  }

  return new RegExp(
    [
      opts.anchorStart === true ? '^' : '',
      ...result,
      opts.anchorEnd === true ? '$' : ''
    ].join(''),
    opts.flags === null
      ? [...new Set(flags)].join('')
      : opts.flags
  );
};
