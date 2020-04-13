'use strict';
const User = require('./user');
const Joi = require('joi');
const MongoModels = require('mongo-models');


class UserDetail extends MongoModels {
    
    
    static create(name, countrycode, phone,
                   agreementfilename, iskycdone, kycdate, kycfile, callback) {

        const self = this;
        const nameParts = name.trim().split(/\s/);
        phone = (typeof phone !== 'undefined') ?  phone : 4084251627; 
        countrycode = (typeof countrycode !== 'undefined') ?  countrycode : 1;
     
        const document = {
            name: {
                first: nameParts.shift(),
                middle: nameParts.length > 1 ? nameParts.shift() : '',
                last: nameParts.join(' ')
            },
            countrycode, 
            phone,
            agreementfilename,
            iskycdone,
            kycdate,
            kycfile,
            timeCreated: new Date()
        };

        this.insertOne(document, (err, docs) => {

            if (err) {
                return callback(err);
            }

            callback(null, docs[0]);
        });
    }

    static findByUsername(username, callback) {

        const query = { 'user.name': username.toLowerCase() };

        this.findOne(query, callback);
    }
}


UserDetail.collection = 'userdetail';


UserDetail.schema = Joi.object({
    _id: Joi.object(),

    user: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().lowercase().required()
    }),
    name: Joi.object({
        first: Joi.string().required(),
        middle: Joi.string().allow(''),
        last: Joi.string().required()
    }),
    
    phone: Joi.number().integer().required(),
    countrycode: Joi.number().min(1).max(999),
    agreementfilename: Joi.string(),
    iskycdone: Joi.boolean().default(false),
    kycdate: Joi.date(),
    kycfile: Joi.string(),
    
    timeCreated: Joi.date()
});


UserDetail.indexes = [
    { key: { 'user.id': 1 } },
    { key: { 'user.name': 1 } }
];


module.exports = UserDetail;
