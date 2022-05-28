'use strict';

const capitalizeFirstCharacter = (...args) => {
    return args.forEach(arg => {
        return `${arg[0].toUpperCase()} ${arg.substr(1)}`
    })
}

module.exports = {
    capitalizeFirstCharacter
}
