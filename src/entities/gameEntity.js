const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Journey = require('./journeyEntity');

const Game = sequelize.define('Game', {
    journey_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Journey,
            key: 'id'
        },
        allowNull: false
    },
    marks: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('marks');
            return rawValue ? JSON.parse(rawValue) : { coords: [], nextMark: 1 };
        },
        set(value) {
            this.setDataValue('marks', JSON.stringify(value));
        }
    },
    links: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('links');
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
            this.setDataValue('links', JSON.stringify(value));
        }
    },
    scenes: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('scenes');
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
            this.setDataValue('scenes', JSON.stringify(value));
        }
    },
    challenges: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('challenges');
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
            this.setDataValue('challenges', JSON.stringify(value));
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
});

Game.belongsTo(Journey, { foreignKey: 'journey_id' });

module.exports = Game;