const Area = require('../entities/areaEntity');

const areas = [
    { title: 'Matemática' },
    { title: 'História' },
    { title: 'Biologia' },
    { title: 'Química' },
    { title: 'Geografia' },
];

const seedAreas = async () => {
    try {
        const existingAreas = await Area.findAll();
        if (existingAreas.length === 0) {
            await Area.bulkCreate(areas);
            console.log('Áreas inseridas com sucesso!');
        } else {
            console.log('Áreas já existem no banco de dados.');
        }
    } catch (error) {
        console.error('Erro ao verificar ou inserir áreas:', error);
    }
};

module.exports = seedAreas;