const capitalizeFirstCharacter = (...args: string[]): string[] => {
    return args.map(arg => {
        if (arg) {
            return `${arg[0].toUpperCase()}${arg.substr(1)}`;
        }

        return arg;
    });
}

export {
    capitalizeFirstCharacter
}
