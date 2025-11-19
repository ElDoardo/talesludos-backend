const { AuthService, UserService, PasswordResetService } = require('../services');
const bcrypt = require('bcryptjs');
const AuthController = {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { user, token } = await AuthService.login(email, password);
            
            res.status(200).json({ 
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    email_verified_at: user.emailVerifiedAt,
                    created_at:user.createdAt,
                    updated_at:user.updatedAt,
                },
                access_token: token,
                token_type: "bearer",
                expires_in: 3600
            });
        } catch (error) {
            res.status(401).json({ 
                error: "Não autorizado"
            });
        }
    },
    async forgotPassword(req, res) {
        try {
            const email = req.body.email;
            const user = await AuthService.forgotPassword(email);
            if(!user) {
                res.status(404).json({
                    error: "Email não encontrado"
                })
            }
            res.status(200).json({ 
                message: "Email enviado com sucesso!"
            });
        } catch (error) {
            res.status(404).json({
                error: "Erro ao enviar email"
            })
        }
    },
    async resetPassword(req, res){
        const {token, email, password} = req.body;
        const passwordReset = await PasswordResetService.findByToken(token);
        if(!passwordReset){
            res.status(404).json({
                error: "Token não encontrado"
            })
        }
        const user = await UserService.findByEmail(email);
        if(!user){
            res.status(404).json({
                error: "Usuário não encontrado"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserService.updateUser(user.id, { password: hashedPassword });
        await PasswordResetService.delete(passwordReset.id);
        res.status(200).json({ data: newUser});
    },
    async logout(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            await AuthService.logout(token);
            res.status(200).json({ message: 'Logout realizado com sucesso' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
};

module.exports = AuthController;