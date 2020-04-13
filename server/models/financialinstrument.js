'use strict';
const User = require('./user');
const Joi = require('joi');
const MongoModels = require('mongo-models');


class FinancialInstrument extends MongoModels {
    
    
    static create( name,address, phone, zipcode, instrumenttype, instumentnumber, 
                   validdate, verificationcode, currency, callback) {

        const self = this;
        const phone = (typeof phone !== 'undefined') ?  phone : 4084251627; 
        const instrumenttype = (typeof instrumenttype !== 'undefined') ?  instrumenttype : 'card';
        
        #need to validate the owner ship of the instruments and if the instrument is actives
        #need to validate accepting currencies
        # to be done here : TBD
        # xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        const document = {
            name,
            address, 
            zipcode, 
            phone,
            isVerified: false,
            instrumenttype,
            instumentnumber,
            validdate,
            verificationcode,
            
            currency,
            
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


FinancialInstrument.collection = 'financialinstument';


FinancialInstrument.schema = Joi.object({
    _id: Joi.object(),

    user: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().lowercase().required()
    }),
    name: Joi.string().min(5).max(300).required(),
    address: Joi.string().min(5).max(300).required(),
    phone: Joi.number().integer().required().required(),
    zipcode: Joi.number().min(1).max(999).required(),
    isVerified: Joi.boolean().default(false),   
    instrumenttype: Joi.string().default('card'),
    instumentnumber: Joi.string().alphanum().required(),
    validdate: Joi.date().min('now').required(),
    verificationcode: Joi.string().alphanum().required(),
            
    currency: Joi.string().length(3),
    
    timeCreated: Joi.date()


FinancialInstrument.indexes = [
    { key: { 'user.id': 1 } },
    { key: { 'user.name': 1 } }
];


module.exports = FinancialInstruments;
