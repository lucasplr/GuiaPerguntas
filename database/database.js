const Sequelize = require('sequelize')

const connection = new Sequelize('guiaperguntas', 'root', '@Lucasplr321', {
    gost: 'localhost',
    dialect: 'mysql'
})

module.exports = connection