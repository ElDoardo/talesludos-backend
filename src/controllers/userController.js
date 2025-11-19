const { UserService } = require('../services');

const UserController = {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            const { user, token } = await UserService.register({ name, email, password });
            
            res.status(201).json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                access_token: token,
                message: 'Registro realizado com sucesso!'
            });
        } catch (error) {
            res.status(400).json({
                message: error.message,
                errors: error.errors || {}
            });
        }
    },
};

module.exports = UserController;