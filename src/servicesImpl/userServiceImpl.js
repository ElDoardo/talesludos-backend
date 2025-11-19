const UserService = require('../services/userService');
const UserRepository = require('../repositories/userRepository');
const { generateToken } = require('../utils/jwt');
const bcrypt = require('bcryptjs');
const User = require('../entities/userEntity');

class UserServiceImpl extends UserService {
    async register(userData) {
        const existingUser = await UserRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('E-mail já cadastrado');
        }

        const user = await UserRepository.create(userData);
        const token = generateToken(user);
        return { user, token };
    }

    async updateUser(id, userData) {
        const user = await UserRepository.findById(id);

        if (!user) {
            throw new Error('Usuário não encontrada');
        }

        return await UserRepository.update(user, userData);
    }

    async validateUser(email, password) {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw new Error('Credenciais inválidas');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Credenciais inválidas');
        }

        return user;
    }

    async findByEmail(email) {
        return await UserRepository.findByEmail(email);
    }
}

module.exports = new UserServiceImpl();