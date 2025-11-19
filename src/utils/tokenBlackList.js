const tokenBlacklist = new Set();

exports.addToBlacklist = (token) => {
    tokenBlacklist.add(token);
};

exports.isBlacklisted = (token) => {
    return tokenBlacklist.has(token);
};