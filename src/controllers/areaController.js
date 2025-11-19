const { AreaService } = require('../services');
const AreaController = {
    async index(req, res) {
        try {
            const areas = await AreaService.findAll();
            res.status(200).json(areas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = AreaController;