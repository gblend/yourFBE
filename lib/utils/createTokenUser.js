const createTokenUser = (user) => {
    if (user) {
        return { name: user.name, id: user._id, role: user.role };
    }
    return user;
}

module.exports = {
    createTokenUser
}
