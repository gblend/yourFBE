export const capitalizeFirstCharacter = (...args: any[]): string[] => {
  return args.map((arg) => {
    if (!arg || typeof arg === 'number') {
      return arg;
    }

    return `${arg[0].toUpperCase()}${arg.substr(1)}`;
  });
};
