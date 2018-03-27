const sequelize = require('sequelize');
const models = require('./../../models');
const {Card} = require('./../../routes/cards/controller');
const moment = require('moment');

before(function () {
    return require('../../models').sequelize.sync();
});


// models.Records.belongsTo(models.Users, {foreignKey: 'userid'});
// models.Records.belongsTo(models.Cards, {foreignKey: 'cardid'});

function generateUUID() {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}
const CardOneId = generateUUID();
const CardTwoId = generateUUID();
const CardThreeId = generateUUID();
const cards = [{
    cardid: CardOneId,
    types: 1,
    cardName: 'Lunch Invitation',
    cardImgURL: 'https://123.com',
    cardNote: "Note test 1"
},{
    cardid: CardTwoId,
    types: 2,
    cardName: 'Movie Invitation',
    cardImgURL: 'https://456.com',
    cardNote: "Note test 2"
},{
    cardid: CardThreeId,
    types: 3,
    cardName: 'Dinner Invitation',
    cardImgURL: 'https://789.com',
    cardNote: "Note test 3"
}];


const RecordOneId = generateUUID();
const RecordTwoId = generateUUID();
const RecordThreeId = generateUUID();
const SenderOneId = generateUUID();
const SenderTwoId = generateUUID();
const SenderThreeId = generateUUID();
const ReceiverOneId = generateUUID();
const ReceiverTwoId = generateUUID();
const ReceiverThreeId = generateUUID();

const records = [{
    recordid: RecordOneId,
    senderid: SenderOneId,
    receiverid: ReceiverOneId,
    cardid: CardOneId,
    expireDate: null,
    createDate: new Date(),
    finishDate: null,
    cardContent: "chenfu invite hyy for lunch.",
    cardTitle: "lunch invitation",
    status: 1
},{
    recordid: RecordTwoId,
    senderid: SenderTwoId,
    receiverid: ReceiverTwoId,
    cardid: CardTwoId,
    expireDate: null,
    createDate: new Date(),
    finishDate: null,
    cardContent: "chenfu invite caizong for movie.",
    cardTitle: "movie invitation",
    status: 1
},{
    recordid: RecordThreeId,
    senderid: SenderThreeId,
    receiverid: ReceiverThreeId,
    cardid: CardThreeId,
    expireDate: null,
    createDate: new Date(),
    finishDate: null,
    cardContent: "chenfu invite xxx for dinner.",
    cardTitle: "dinner invitation",
    status: 1
}];


const populateCards = (done)=>{
    models.Card.destroy({
        where: {},
        truncate: true
    }).then(()=>{
        const cardOne = models.Card.create(cards[0]).then((card)=>{
            return card;
            
    });
        const cardTwo =  models.Card.create(cards[1]).then((card)=>{
            return card;
    });
        return Promise.all([cardOne, cardTwo])
    }).then(()=> done());
}

const populateRecords = (done)=>{
    models.Record.destroy({
        where: {},
        truncate: true
    }).then(()=>{
        const recordOne = models.Record.create(records[0]).then((record)=>{
            return record;
            
    });
        const recordTwo =  models.Record.create(records[1]).then((record)=>{
            return record;
    });
        return Promise.all([recordOne, recordTwo])
    }).then(()=> done());
}
module.exports = {cards, populateCards, records, populateRecords};

