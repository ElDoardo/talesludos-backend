const PasswordResetRepository = require("../repositories/passwordResetRepository");
const PasswordResetService = require("../services/passwordResetService");

class PasswordResetServiceImpl extends PasswordResetService {
    async findByEmail(email) {
        return await PasswordResetRepository.findByEmail(email);
    }

    async findByToken(token) {
        return await PasswordResetRepository.findByToken(token);
    }

    async create(passwordResetData) {
        const existingEmail = await PasswordResetRepository.findByEmail(passwordResetData.email);

        if (existingEmail) {
            throw new Error('E-mail já cadastrado.');
        }

        const passwordReset = await PasswordResetRepository.create(passwordResetData);
        return passwordReset;
    }

    async delete(id) {
        const passwordReset = await PasswordResetRepository.findById(id);

        if (!passwordReset) {
            throw new Error('Email não encontrado.');
        }
        
        return await PasswordResetRepository.delete(passwordReset);
    }
}

module.exports = new PasswordResetServiceImpl();