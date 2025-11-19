const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userEntity');
const Area = require('./areaEntity'); 

const Journey = sequelize.define('Journey', {
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        },
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    imagePath: {
        type: DataTypes.STRING,
        allowNull: true
    },
    area_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Area,
            key: 'id'
        },
        allowNull: false
    },
    publish: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    gameType: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
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
}, {
    timestamps: true
});

Journey.belongsTo(User, { foreignKey: 'user_id' });
Journey.belongsTo(Area, { foreignKey: 'area_id' });

module.exports = Journey;
