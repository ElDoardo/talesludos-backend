'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('Areas', [
      { title: 'Ciências Exatas e da Terra', createdAt: now, updatedAt: now },
      { title: 'Ciências Biológicas',        createdAt: now, updatedAt: now },
      { title: 'Engenharia/Tecnologia',      createdAt: now, updatedAt: now },
      { title: 'Ciências da Saúde',          createdAt: now, updatedAt: now },
      { title: 'Ciências Agrárias',          createdAt: now, updatedAt: now },
      { title: 'Ciências Sociais',           createdAt: now, updatedAt: now },
      { title: 'Ciências Humanas',           createdAt: now, updatedAt: now },
      { title: 'Linguística',                createdAt: now, updatedAt: now },
      { title: 'Letras e Artes',             createdAt: now, updatedAt: now },
    ], {});
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('Areas', null, {});
  }
};
