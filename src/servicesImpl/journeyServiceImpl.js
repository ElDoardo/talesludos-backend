const JourneyService = require('../services/journeyService');
const JourneyRepository = require('../repositories/journeyRepository');
const GameRepository = require('../repositories/gameRepository');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const journeyRepository = require('../repositories/journeyRepository');
const fsp = fs.promises;

class JourneyServiceImpl extends JourneyService {
    async getUserJourneys(userId, { page = 1, perPage = 3 }) {
        const offset = (page - 1) * perPage;
        const { count, rows } = await JourneyRepository.findAndCountAllJourneyUserArea(userId, perPage, offset);

        return {
            data: rows,
            total: count,
            currentPage: page,
            perPage: perPage,
            lastPage: Math.ceil(count / perPage)
        };
    }

    async getPublishedJourneys({ page = 1, perPage = 3, areaId = null, baseUrl = '' }) {
        const offset = (page - 1) * perPage;
        const where = { publish: true };

        if (areaId) {
            where.area_id = areaId;
        }
        const { count, rows } = await JourneyRepository.findAndCountAllJourneyUser(where, perPage, offset);

        const lastPage = Math.ceil(count / perPage);

        const path = `${baseUrl}/api/journey/index`;
        const makePageUrl = (p) => p ? `${path}?page=${p}` : null;

        const from = count > 0 ? offset + 1 : null;
        const to = Math.min(offset + perPage, count);
        return {
            current_page: page,
            data: rows,
            first_page_url: makePageUrl(1),
            from,
            last_page: lastPage,
            last_page_url: makePageUrl(lastPage),
            next_page_url: page < lastPage ? makePageUrl(page + 1) : null,
            path,
            per_page: perPage,
            prev_page_url: page > 1 ? makePageUrl(page - 1) : null,
            to,
            total: count
        };
    }

    async getJourneyById(id) {
        return await JourneyRepository.findById(id);
    }

    async prepareDownload(userId, journeyId) {
        const baseDir = path.join(__dirname, '../../storage/games', String(userId), String(journeyId));
        const gamePath = path.join(baseDir, 'Game1');

        const zipPath = path.join(baseDir, `jornada-${journeyId}-${Date.now()}.zip`);

        try {
            await fsp.access(gamePath);
        } catch {
            throw new Error('Arquivos do jogo não encontrados');
        }

        await fsp.mkdir(baseDir, { recursive: true });

        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        return new Promise((resolve, reject) => {
            output.on('close', () => resolve(zipPath));
            output.on('error', reject);
            archive.on('error', reject);

            archive.pipe(output);
            archive.directory(gamePath, false);
            archive.finalize();
        });
    }

    async processBase64Image(base64Data, userId) {
        const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
        if (!matches) {
            throw new Error('Formato de imagem inválido');
        }

        const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
        const filename = `${uuidv4()}.${extension}`;
        const folderPath = path.join('storage', 'games', userId.toString(), 'img');
        const fullPath = path.join(folderPath, filename);
        const relativePath = `/games/${userId}/img/${filename}`;

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        await fs.promises.writeFile(
            fullPath,
            matches[2],
            'base64'
        );

        return relativePath;
    }

    async createJourney(journeyData) {
        const journey = await JourneyRepository.create(journeyData);

        await GameRepository.create({
            journey_id: journey.id,
            marks: "{\"coords\":[],\"nextMark\":1}",
            links: "[]",
            scenes: "[]",
            challenges: "[]"
        });

        return journey;
    }

    async updateJourney(id, journeyData) {
        const journey = await JourneyRepository.findById(id);

        if (!journey) {
            throw new Error('Jornada não encontrada');
        }

        if (journeyData.imagePath && journey.imagePath) {
            const oldImagePath = path.join(__dirname, `../../${journey.imagePath}`);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        return await JourneyRepository.update(journeyData);
    }

    async deleteJourney(id) {
        const journey = await JourneyRepository.findById(id);

        if (!journey) {
            throw new Error('Jornada não encontrada');
        }

        if (journey.imagePath) {
            const imagePath = path.join(__dirname, `../../${journey.imagePath}`);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        const gamePath = path.join(__dirname, `../../storage/games/${journey.user_id}/${journey.id}`);
        if (fs.existsSync(gamePath)) {
            fs.rmSync(gamePath, { recursive: true });
        }

        return await journeyRepository.delete(journey);
    }
}

module.exports = new JourneyServiceImpl();