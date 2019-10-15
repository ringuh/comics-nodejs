module.exports = function (seq, type) {
    //const { Op } = require('sequelize');
    const Model = seq.define('Strip', {
        id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
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
    }, {
        timestamps: true,
    });

    Model.prototype.toJson = function () {
        let ret = this.dataValues
        return ret
    }


    Model.associate = models => {
        
        Model.belongsTo(models.Comic, {
            //onDelete: "CASCADE",
            foreignKey: 'comic_id',
        });
        Model.hasMany(models.Strip, {
            as: 'images',
            foreignKey: 'strip_id',
            allowNull: false
        });
    };

    return Model
}

