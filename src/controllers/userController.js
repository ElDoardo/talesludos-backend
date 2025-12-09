const { UserService, JourneyService } = require('../services');

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
    async index(req, res) {
        try {
            const userId = req.params.userId;
            const page = 1;

            const journeys = await JourneyService.getUserJourneys(userId, {
                page: parseInt(page),
                perPage: 3
            });
            res.status(200).json(journeys);
        } catch (error) {
            res.status(500).json({
                message: 'Erro ao carregar jornadas',
                error: error.message
            });
        }
    }
};


module.exports = UserController;