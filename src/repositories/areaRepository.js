const Area = require('../entities/areaEntity');

class AreaRepository {
    async findAll() {
        return await Area.findAll({ order: [['id', 'ASC']] });
    }
}

module.exports = new AreaRepository();