const { JourneyService } = require('../services');
const { verifyToken } = require('../middlewares/authMiddleware');
const upload = require('../config/multer');
const fs = require('fs');
const path = require('path');

class JourneyController {

    async listAll(req, res) {
        try {
            const { page = 1, area } = req.query;

            const journeys = await JourneyService.getPublishedJourneys({
                page: parseInt(page),
                perPage: 3,
                areaId: area
            });

            res.status(200).json(journeys);
        } catch (error) {
            res.status(500).json({
                message: 'Erro ao carregar jornadas públicas',
                error: error.message
            });
        }
    }

    async view(req, res) {
        try {
            const id = req.params.journeyId;
            const journey = await JourneyService.getJourneyById(id);

            if (!journey) {
                return res.status(404).json({ message: 'Jornada não encontrada' });
            }

            res.status(200).json(journey);
        } catch (error) {
            res.status(500).json({
                message: 'Erro ao carregar jornada',
                error: error.message
            });
        }
    }

    async download(req, res, next) {
        try {
            const { userId, journeyId } = req.params;
            const filePath = await JourneyService.prepareDownload(userId, journeyId);
            const filename = `jornada-${journeyId}.zip`;

            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

            const stream = fs.createReadStream(filePath);
            stream.on('error', next);
            stream.pipe(res);

            res.on('finish', () => fs.unlink(filePath, () => {}));
        } catch (err) {
            next(err);
        }
    }

    async store(req, res) {
        try {
            const { title, description, area_id, publish } = req.body;

            if (!req.file) {
                return res.status(400).json({ message: 'A escolha da IMAGEM é obrigatória' });
            }

            const userId = req.user.id;
            const imagePath = `${userId}/${req.file.filename}`;
            const imageUrl = `${req.protocol}://${req.get('host')}${imagePath}`; // útil pro front
            
            const journeyData = {
                user_id: userId,
                title: (title || '').trim(),
                description,
                area_id: Number.parseInt(area_id, 10) || null,
                publish: publish === '1' || publish === 'true' || publish === true,
                imagePath, // ex.: /storage/games/1/img/123.png
            };

            const journey = await JourneyService.createJourney(journeyData);
            const payload = typeof journey?.toJSON === 'function' ? journey.toJSON() : journey;

            return res.status(201).json({ ...payload, imageUrl });
        } catch (error) {
            if (req.file?.path) {
                try { fs.unlinkSync(req.file.path); } catch { /* ignore */ }
            }
            return res.status(500).json({
                message: 'Erro na criação do Game',
                error: error.message,
            });
        }
    }


    async update(req, res) {
        try {
            const id = req.params.journeyId;
            const userId = req.user.id;

            const journeyData = {
                ...req.body,
                user_id: userId
            };

            if (req.file) {
                journeyData.imagePath = `${userId.toString()}/${req.file.filename}`
            }

            const journey = await JourneyService.updateJourney(id, journeyData);

            res.status(200).json(journey);
        } catch (error) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(400).json({
                message: 'Erro ao atualizar jornada',
                error: error.message,
                errors: error.errors
            });
        }
    }

    async edit(req, res) {
        try {
            const { id } = req.params;
            const journey = await JourneyService.getJourneyById(id);

            if (!journey) {
                return res.status(404).json({ message: 'Jornada não encontrada' });
            }

            res.status(200).json(journey);
        } catch (error) {
            res.status(500).json({
                message: 'Erro ao carregar jornada para edição',
                error: error.message
            });
        }
    }

    async destroy(req, res) {
        try {
            const id = req.params.journeyId;
            await JourneyService.deleteJourney(id);

            res.status(204).send();
        } catch (error) {
            res.status(500).json({
                message: 'Erro ao excluir jornada',
                error: error.message
            });
        }
    }

    async sendImage(req, res) {
        try {
            const userId = req.params.userId;
            const fileName = String(req.params.fileName || req.params.file || '');

            if (!userId) {
                return res.status(400).json({ message: 'userId inválido' });
            }
            if (!fileName || fileName.includes('..') || path.isAbsolute(fileName)) {
                return res.status(400).json({ message: 'nome de arquivo inválido' });
            }
            const absPath = path.join(process.cwd(), 'storage', 'games', userId, 'img', fileName);

            if (!fs.existsSync(absPath)) {
                return res.status(404).json({ message: 'Imagem não encontrada' });
            }

            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

            return res.sendFile(absPath);
        } catch (err) {
            console.error('sendImage error:', err);
            return res.status(500).json({ message: 'Erro ao enviar a imagem' });
        }
    }

}

module.exports = new JourneyController();