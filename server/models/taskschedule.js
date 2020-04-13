'use strict';
const User = require('./user');
const FinancialInstrument = require('../financialinstrument');
const Payee = require('../payee');
const Joi = require('joi');
const MongoModels = require('mongo-models');


class TaskSchedule extends MongoModels {
    
    
    static create( name,startdate, enddate , frequency, cronexpression, isenabled, 
                   amount, currency, callback) {

        const self = this;
        const amount = (typeof ampunt !== 'undefined') ?  amount : 1.00; 
        
       
        const document = {
            name,
            startdate, 
            enddate, 
            frequency,
            cronexpression,
            
            isenabled: true,
            
            
            amount,
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


TaskSchedule.collection = 'taskschedule';


TaskSchedule.schema = Joi.object({
    _id: Joi.object(),

    user: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().lowercase().required()
    }),
    financialinstrument: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().lowercase().required()
    }),
    payee: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().lowercase().required()
    }),
    
    name: Joi.string().min(5).max(300).required(),
    startdate: Joi.date().min('now').required(),
    enddate: Joi.date().required();
    frequency: Joi.string().min(5).max(15).required(),
    cronexpression: Joi.string().min(5).max(100).required(),
    
    isenabled: Joi.boolean().default(true),
        
    
    amount: Joi.number().greater(5).required(),       
    currency: Joi.string().length(3).required,
    
    timeCreated: Joi.date()


TaskSchedule.indexes = [
    { key: { 'user.id': 1 } },
    { key: { 'financialinstument.id' : 1 } },
    { key: { 'payee.id' : 1 } },
    
];


module.exports = TaskSchedule;
