module.exports = function (seq, type) {
    //const { Op } = require('sequelize');
    const Model = seq.define('Image', {
        id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        filename: {
            type: type.STRING,
            trim: true,
        },
        url: {
            type: type.STRING,
            validate: {
                isUrl: true
            },
            trim: true
        },
        hash: {
            type: type.STRING,
        }
    }, {
        timestamps: true,
    });

    Model.prototype.toJson = function () {
        let ret = this.dataValues
        return ret
    }


    Model.associate = models => {
        Model.belongsTo(models.Strip, {
            //onDelete: "CASCADE",
            foreignKey: 'strip_id',
        })
    };

    return Model
}

