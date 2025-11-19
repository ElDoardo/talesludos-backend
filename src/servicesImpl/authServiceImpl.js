const AuthService = require('../services/authService');
const UserService = require('./userServiceImpl');
const UserRepository = require('../repositories/userRepository');
const { sendResetPasswordEmail } = require("../utils/mailer");
const { generateToken } = require('../utils/jwt');
const { addToBlacklist } = require('../utils/tokenBlackList');

class AuthServiceImpl extends AuthService {
    async login(email, password) {
        const user = await UserService.validateUser(email, password);
        const token = generateToken(user);
        return { user, token };
    }

    async forgotPassword(email) {
        const user = await UserRepository.findByEmail(email);
        if (!user){
            throw new Error('Usuário não encontrado');
        }
        await sendResetPasswordEmail(user);
        return user;
        
    }
    
    async logout(token) {
        if (!token) {
            throw new Error('Token não fornecido');
        }

        addToBlacklist(token);
    }
}

module.exports = new AuthServiceImpl();