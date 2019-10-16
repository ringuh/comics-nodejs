module.exports = function (seq, type) {
    //const { Op } = require('sequelize');
    const Model = seq.define('Strip', {
        id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        order: {
            type: type.INTEGER,
            defaultValue: 1,
            allowNull: false,
        },
        title: {
            type: type.STRING,
            trim: true,
        },
        raw_src: {
            type: type.STRING,
            validate: {
                isUrl: true
            },
            trim: true
        },
        page_url: {
            type: type.STRING,
            validate: {
                isUrl: true
            },
        },
        hash: {
            type: type.STRING,
        },
        date: {
            type: type.DATEONLY,
            allowNull: false,
            defaultValue: type.NOW
        }
    }, {
        timestamps: true,
    });

    Model.prototype.toJson = function () {
        let ret = this.dataValues
        if (this.comic) {
            ret.comic = this.comic
            ret.path = `http://localhost:3001/static/comics/${this.comic.alias}/${this.comic.alias}_${this.order}.webp`
        }

        return ret
    }


    Model.associate = models => {

        Model.belongsTo(models.Comic, {
            as: 'comic',
            //onDelete: "CASCADE",
            foreignKey: 'comic_id',

        });
        /* Model.hasMany(models.Strip, {
            as: 'images',
            foreignKey: 'strip_id',
            allowNull: false
        }); */
    };

    return Model
}

