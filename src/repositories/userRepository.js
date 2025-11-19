const User = require('../entities/userEntity');

class UserRepository {
    async findByEmail(email) {
        return await User.findOne({ where: { email } });
    }

    async create(userData) {
        return await User.create(userData);
    }

    async findById(id) {
        return await User.findByPk(id);
    }

    async update(user, userData) {
        return await user.update(userData);
    }
}

module.exports = new UserRepository();