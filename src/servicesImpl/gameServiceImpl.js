const GameService = require('../services/gameService');
const GameRepository = require('../repositories/gameRepository');
const JourneyRepository = require('../repositories/journeyRepository');
const fs = require('fs');
const path = require('path');
const { generateGameIndex, generateGameScript } = require('../utils/fileGenerator');

class GameServiceImpl extends GameService {
    async getGameForEdit(journeyId, userId) {
        const game = await GameRepository.findByJourneyId(journeyId);
        if (!game) throw new Error('Jogo não encontrado');
        
        const journey = await JourneyRepository.findById(game.journey_id);
        if (!journey) throw new Error('Jornada não encontrada');

        // Garante que a imagem venha no formato /games/{userId}/img/{fileName}
        const normalizedImagePath = journey.imagePath.replace(/\\/g, '/');
        const imageName = path.basename(normalizedImagePath);
        const imageUrl = `${userId}/${imageName}`;
        return {
            game: {
                ...game,
                marks: game.marks || { coords: [], nextMark: 1 },
                links: game.links || [],
                scenes: game.scenes || [],
                challenges: game.challenges || []
            },
            image: imageUrl,
            title: journey.title
        };
    }

    async updateGame(id, gameData) {
        const dataToUpdate = {
            marks: gameData.marks || { coords: [], nextMark: 1 },
            links: gameData.links || [],
            scenes: gameData.scenes || [],
            challenges: gameData.challenges || []
        };
        const updatedGame = await GameRepository.update(id, dataToUpdate);
        if (!updatedGame) throw new Error('Falha ao atualizar o jogo');
        
        return updatedGame;
    }

    async generateGameFiles(journeyId, userId) {
        const game = await GameRepository.findByJourneyId(journeyId);
        if (!game) throw new Error('Jogo não encontrado');

        const journey = await JourneyRepository.findById(journeyId);
        if (!journey) throw new Error('Jornada não encontrada');

        const root = process.cwd(); // pasta raiz do projeto

        const basePath = path.join(root, 'storage', 'games', String(userId), String(journeyId));
        const basePathImage = path.join(root, 'storage', 'games', String(userId));
        const gamePath = path.join(basePath, 'Game1');
        const mediaDir = path.join(gamePath, 'media');
        const imageName = journey.imagePath.split('/')[1];

        await this._ensureDirectoryExists(gamePath);
        await this._ensureDirectoryExists(path.join(gamePath, 'config'));
        await this._ensureDirectoryExists(mediaDir);
        
        await this._copyBaseGameFiles(gamePath);
        let sourceImagePath = path.join(basePathImage, 'img');
        sourceImagePath = path.join(sourceImagePath, imageName);
        const destImagePath = path.join(mediaDir, imageName);
        await fs.promises.access(sourceImagePath); // lança se não existir
        await fs.promises.mkdir(mediaDir, { recursive: true });
        
        await fs.promises.copyFile(sourceImagePath, destImagePath);
        await generateGameIndex({ folder: path.join(basePath, 'Game1/'), imageName });
        await generateGameScript({
            folder: path.join(basePath, 'Game1/'),
            title: journey.title,
            description: journey.description,
            marks: game.marks,
            links: game.links,
            scenes: game.scenes,
            challenges: game.challenges,
        });
    }

    async _ensureDirectoryExists(dirPath) {
        try {
            await fs.promises.access(dirPath);
        } catch {
            await fs.promises.mkdir(dirPath, { recursive: true });
        }
    }
    
    async _copyBaseGameFiles(destinationPath) {
        const baseGamePath = path.join('storage', 'base', 'Game1');
        const files = await fs.promises.readdir(baseGamePath, { withFileTypes: true });
        
        for (const file of files) {
            const source = path.join(baseGamePath, file.name);
            const destination = path.join(destinationPath, file.name);
            
            if (file.isDirectory()) {
                await this._copyDirectory(source, destination);
            } else {
                await fs.promises.copyFile(source, destination);
            }
        }
    }
    
    async _copyDirectory(source, destination) {
        await this._ensureDirectoryExists(destination);
        const files = await fs.promises.readdir(source, { withFileTypes: true });
        
        for (const file of files) {
            const srcPath = path.join(source, file.name);
            const destPath = path.join(destination, file.name);
            
            if (file.isDirectory()) {
                await this._copyDirectory(srcPath, destPath);
            } else {
                await fs.promises.copyFile(srcPath, destPath);
            }
        }
    }
}

module.exports = new GameServiceImpl();