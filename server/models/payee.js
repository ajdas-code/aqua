'use strict';
const User = require('./user');
const Joi = require('joi');
const MongoModels = require('mongo-models');


class Payee extends MongoModels {
    
    
    static create(name,address, countrycode, phone,transfertype, bankname, branchaddress, branchphone, 
                  branchcode,bankcode,accountno, currency, callback) {

        const self = this;
        const phone = (typeof phone !== 'undefined') ?  phone : 4084251627; 
        const countrycode = (typeof countrycode !== 'undefined') ?  countrycode : 1;
        const transfertype = (typeof transfertype !== 'undefined') ?  transfertype : 'ach';
        const branchphone = (typeof branchphone !== 'undefined') ?  branchphone : phone;
        
        #need to static validate the payee branch information before saving 
        #need to validate accepting currencies
        # to be done here : TBD
        # xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        const document = {
            name,
            address, 
            countrycode, 
            phone,
            
            transfertype,
            bankname,
            branchaddress,
            branchphone,
            branchcode,
            bankcode,
            
            accountno,
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


Payee.collection = 'payee';


Payee.schema = Joi.object({
    _id: Joi.object(),

    user: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().lowercase().required()
    }),
    name: Joi.string().min(5).max(300).required(),
    address: Joi.string().min(5).max(300),
    phone: Joi.number().integer().required(),
    countrycode: Joi.number().min(1).max(999),
    
    transfertype: Joi.string().default('ach'),
    bankname: Joi.string().min(2).max(100),
    bankaddress: Joi.string().min(5).max(300),
    bankphone: Joi.number().integer(),
    branchcode:Joi.string().min(2).max(100) ,
    bankcode: Joi.string().min(2).max(100),
            
    accountno: Joi.string().alphanum().required(),
    currency: Joi.string().length(3),
    
    timeCreated: Joi.date()


Payee.indexes = [
    { key: { 'user.id': 1 } },
    { key: { 'user.name': 1 } }
];


module.exports = Payee;