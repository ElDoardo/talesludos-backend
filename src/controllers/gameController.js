const { GameService } = require('../services');

const GameController = {
    async edit(req, res) {
        try {
            const { id } = req.params; // id = journeyId
            const userId = req.user.id;

            const gameData = await GameService.getGameForEdit(id, userId);

            res.status(200).json({
                game: gameData.game,
                image: gameData.image,
                title: gameData.title
            });
        } catch (error) {
            res.status(500).json({ 
                error: 'Erro ao carregar jogo',
                message: error.message 
            });
        }
    },
    async update(req, res) {
        try {
            const { id } = req.params; // id = journeyId
            const userId = req.user.id;
            const gameData = req.body;
            
            const dataToUpdate = {
                marks: gameData.marks || { coords: [], nextMark: 1 },
                links: gameData.links || [],
                scenes: gameData.scenes || [],
                challenges: gameData.challenges || []
            };
            
            const updatedGame = await GameService.updateGame(id, dataToUpdate);
            await GameService.generateGameFiles(id, userId);
            res.status(200).json(updatedGame);
        } catch (error) {
            res.status(500).json({ 
                error: 'Falha ao atualizar game',
                message: error.message 
            });
        }
    }
};

module.exports = GameController;