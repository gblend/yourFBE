'use strict';

const capitalizeFirstCharacter = (...args) => {
    return args.map(arg => {
        if (arg) {
            return `${arg[0].toUpperCase()}${arg.substr(1)}`;
        }

        return arg;
    });
}

module.exports = {
    capitalizeFirstCharacter
}
