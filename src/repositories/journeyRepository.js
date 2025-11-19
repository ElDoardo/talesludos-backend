const Journey = require('../entities/journeyEntity');
const User = require('../entities/userEntity');
const Area = require('../entities/areaEntity');

class JourneyRepository {
    async create(journeyData) {
        return await Journey.create({
            user_id: journeyData.user_id,
            title: journeyData.title,
            description: journeyData.description,
            imagePath: journeyData.imagePath,
            area_id: journeyData.area_id,
            publish: journeyData.publish
        });
    }

    async findById(id) {
        return await Journey.findByPk(id, {
            include: [
                { model: User, attributes: ['name', 'email'] },
                { model: Area, attributes: ['title'] }
            ]
        });
    }

    async update(journeyData) {
        const journey = await Journey.findByPk(journeyData.id);
        if (!journey) {
            throw new Error('Jornada não encontrada');
        }
        return await journey.update(journeyData);
    }

    async delete(journey) {
        return await journey.destroy();
    }

    async findAndCountAllJourneyUserArea(userId, perPage, offset) {
        return await Journey.findAndCountAll({
            where: { user_id: userId },
            order: [['id', 'DESC']],
            limit: perPage,
            offset: offset,
            include: [
                { model: User, attributes: ['name'] },
                { model: Area, attributes: ['title'] }
            ]
        });
    }

    async findAndCountAllJourneyUser(where, perPage, offset) {
        return await Journey.findAndCountAll({
            where,
            order: [['id', 'DESC']],
            limit: perPage,
            offset,
            include: [
                { model: User, attributes: ['name'] }
            ]
        });
    }
}

module.exports = new JourneyRepository();