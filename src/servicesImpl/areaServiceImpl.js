const AreaService = require('../services/areaService');
const AreaRepository = require('../repositories/areaRepository');

class AreaServiceImpl extends AreaService {
    async findAll() {
        return await AreaRepository.findAll();
    }
}

module.exports = new AreaServiceImpl();