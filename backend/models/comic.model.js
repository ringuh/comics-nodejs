module.exports = function (seq, type) {
    //const { Op } = require('sequelize');
    const Model = seq.define('Comic', {
        id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: type.STRING,
            unique: { args: true, msg: "Comic name already in use" },
            allowNull: false,
            trim: true,
            validate: {
                len: [1, 100]
            },
            set(val) {
                this.alias = val
                this.setDataValue('name', val)
            }
            //slugify: true
        },
        alias: { // slugified version of the name
            type: type.STRING,
            unique: { args: true, msg: "Comic alias needs to be unique" },
            trim: true,
            slugify: true,
            allowNull: true,
        },
        author: {
            type: type.STRING,
        },
        url: {
            type: type.STRING,
            validate: {
                isUrl: true
            },
            trim: true
        }, // URL to the book
        last_url: {
            type: type.STRING,
            validate: {
                isUrl: true
            },
        },
        regex: { // fault checking for the url
            type: type.STRING,
        },
        title_path: { // dom path to title text
            type: type.STRING,
        },
        comic_path: { // dom path to the potential comic image
            type: type.STRING,
        },
        next_path: { // link to the next chapter
            type: type.STRING,
        },
        list_path: { // can be used instead of next_path if all comic paths are found on list
            type: type.STRING
        },
        image_src: {
            type: type.STRING,
            defaultValue: "src",
            allowNull: false
        },
        extension: { // if the image extension is unclear pick one of these
            type: type.STRING,
            validate: {
                isIn: [['jpg', 'jpeg', 'gif', 'png', 'webp']]
            }
        },
        dom_navigation: { // potential dom elements to click, split by pipe
            // button.yes | wait | button.yes2
            type: type.STRING
        },
        javascript: {
            type: type.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        is_daily: {
            type: type.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        genre: {
            type: type.STRING,
            validate: {
                isIn: [['xxx']]
            }
        },
        /* disabled: {
            type: type.BOOLEAN,
            defaultValue: false
        },
        last_attempt: {
            type: type.DATETIME,
        }, */

    },
        {
            timestamps: true,
        });

    Model.prototype.toJson = function (user) {
        let ret = this.dataValues
        if(this.strips)
            ret.strips = this.strips.map(strip => strip.toJson(this.alias))
        return ret
    }


    Model.associate = models => {
        Model.hasMany(models.Strip, {
            as: 'strips',
            foreignKey: 'comic_id',
            allowNull: false
        })
    };

    return Model
}

