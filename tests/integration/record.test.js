const expect = require('expect');
const request = require('supertest');
const _ = require('lodash');
const sequelize = require('sequelize');

const {app} = require('./../../app');
const models = require('./../../models');


const {cards, populateCards, users, populateUsers, records, populateRecords, messages, populateMessages } = require('./../seed/seed');

beforeEach(populateCards);
beforeEach(populateUsers);
beforeEach(populateRecords);
beforeEach(populateMessages);

describe('POST /record/record ', ()=>{
    it('should create a new record and a new message', (done)=>{
        request(app)
            .post('/record/record')
            .send({
                senderid: records[0].senderid,
                receiverEmail: users[0].email,
                cardid: records[0].cardid,
                expireDate: null,
                cardContent: "chenfu invite xxx for dinner.",
                cardTitle: "dinner invitation",
                title: messages[2].title,
                msgContent: messages[2].msgContent
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.cardTitle).toBe(records[2].cardTitle);
                expect(res.body.receiverid).toBe(users[0].uid);
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                models.Record.findAll({ where: { cardTitle: records[2].cardTitle }, raw : true }).then((record)=>{
                    expect(record.length).toBe(1);
                    expect(record[0].cardTitle).toBe(records[2].cardTitle);
                }).catch((e)=> done(e));
                models.Message.findAll({raw : true }).then((message)=>{
                    expect(message.length).toBe(3);
                    done();
                }).catch((e)=> done(e));
            });
    });
    it('should not create record with invalid data',(done)=>{
        request(app)
            .post('/record/record')
            .send()
            .expect(400)
            .end((err, res)=>{
                if(err){
                    return done(err);
                }
                models.Record.findAll({ raw: true }).then((res)=>{
                    expect(res.length).toBe(2);
                    done();
                }).catch((e)=> done(e));
            });
    });
});

describe('GET /record/record', ()=>{
    it('should get all records', (done)=>{
        request(app)
            .get('/record/record')
            .expect(200)
            .expect((res)=>{
                expect(res.body.length).toBe(2);
                expect(res.body[0].senderName).toBeTruthy();
                expect(res.body[0].senderURL).toBeTruthy();
            })
            .end(done);
    })
})

describe('GET /record/record/sender/senderid', ()=>{
    it('should get all records', (done)=>{
        request(app)
            .get(`/record/record/sender/${records[0].senderid}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.length).toBe(1);
                expect(res.body[0].senderName).toBe(users[0].username);
                expect(res.body[0].senderURL).toBeTruthy();
            })
            .end(done);
    })
})

describe('GET /record/record/sender/senderid/friend/friendid', ()=>{
    it('should get all records', (done)=>{
        request(app)
            .get(`/record/record/sender/${records[0].senderid}/friend/${records[0].receiverid}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.length).toBe(1);
                expect(res.body[0].senderName).toBe(users[0].username);
                expect(res.body[0].senderURL).toBeTruthy();
            })
            .end(done);
    })
})

describe('GET /record/record/receiver/receiverid/friend/friendid', ()=>{
    it('should get all records', (done)=>{
        request(app)
            .get(`/record/record/receiver/${records[0].receiverid}/friend/${records[0].senderid}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.length).toBe(1);
                expect(res.body[0].senderName).toBe(users[0].username);
                expect(res.body[0].senderURL).toBeTruthy();
            })
            .end(done);
    })
})
describe('GET /record/record/sender/senderid/status', ()=>{
    it('should get all records', (done)=>{
        request(app)
            .get(`/record/record/sender/${records[0].senderid}/${records[0].status}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.length).toBe(1);
                expect(res.body[0].senderURL).toBeTruthy();
            })
            .end(done);
    })
})

describe('POST /record/usecard', ()=>{
    it('should update record status and send a new message', (done)=>{
        const titleAuto = users[1].username + ' send ' + users[0].email + ' a using request { ' + cards[0].cardName + ' }.';
        request(app)
            .post('/record/usecard')
            .send({
                recordid: records[0].recordid,
                title: 'Dinner Invitation',
                msgContent: 'This is a dinner invitation from yx',
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.senderid).toBe(records[0].receiverid);
                expect(res.body.title).toBe(titleAuto);
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                models.Record.findOne({ where: { recordid: records[0].recordid }, raw : true }).then((record)=>{
                    expect(record.status).toBe(6);
                }).catch((e)=> done(e));
                models.Message.findAll({ raw : true }).then((message)=>{
                    expect(message.length).toBe(3);
                    done();
                }).catch((e)=> done(e));
            });
    });
    it('should not send message with invalid data',(done)=>{
        request(app)
            .post('/record/usecard')
            .send()
            .expect(400)
            .end((err, res)=>{
                if(err){
                    return done(err);
                }
                models.Message.findAll({ raw: true }).then((res)=>{
                    expect(res.length).toBe(2);
                    done();
                }).catch((e)=> done(e));
            });
    });
});

describe('POST /record/usecardreply', ()=>{
    it('should update record status and send a new message', (done)=>{
        request(app)
            .post('/record/usecardreply')
            .send({
                recordid: records[0].recordid,
                recordstatus: 1,
                title: 'REJECTED',
                msgContent: 'Oh~ No! Your friend reject your invitation.',
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.senderid).toBe(records[0].senderid);
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                models.Record.findOne({ where: { recordid: records[0].recordid }, raw : true }).then((record)=>{
                    expect(record.status).toBe(1);
                }).catch((e)=> done(e));
                models.Message.findAll({ raw : true }).then((message)=>{
                    expect(message.length).toBe(3);
                    done();
                }).catch((e)=> done(e));
            });
    });
    it('should not send message with invalid data',(done)=>{
        request(app)
            .post('/record/usecard')
            .send()
            .expect(400)
            .end((err, res)=>{
                if(err){
                    return done(err);
                }
                models.Message.findAll({ raw: true }).then((res)=>{
                    expect(res.length).toBe(2);
                    done();
                }).catch((e)=> done(e));
            });
    });
});


describe('GET /record/record/receiver/receiverid', ()=>{
    it('should get all records', (done)=>{
        request(app)
            .get(`/record/record/receiver/${records[0].receiverid}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.length).toBe(1);
                expect(res.body[0].senderURL).toBeTruthy();
            })
            .end(done);
    })
})

describe('GET /record/record/receiver/receiverid/status', ()=>{
    it('should get all records', (done)=>{
        request(app)
            .get(`/record/record/receiver/${records[0].receiverid}/${records[0].status}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.length).toBe(1);
                expect(res.body[0].senderURL).toBeTruthy();
            })
            .end(done);
    })
})
describe('GET /record/:id',()=>{
    it('should return record',(done)=>{
        request(app)
            .get(`/record/record/${records[0].recordid}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.cardTitle).toBe(records[0].cardTitle);
                expect(res.body.senderName).toBe(users[0].username);
                expect(res.body.senderURL).toBeTruthy();
            })
            .end(done);
    });
    it('should return 400 for non-object ids',(done)=>{
        var wrongId = "abcd3";
        request(app)
            .get(`/record/record/${wrongId}`)
            .expect(400)
            .end(done);
    });
});

describe('DELETE /record/:id', ()=>{
    it('should remove a record',(done)=>{
        request(app)
            .delete(`/record/record/${records[0].recordid}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.recordid).toBe(records[0].recordid);
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                models.Record.findAll({ where: { recordid: records[0].recordid }, raw : true }).then((record)=>{
                    expect(record.length).toBe(0);
                    done();
                }).catch((e)=>done(e));  
            });
    });
    it('should return 400 if card not found', (done)=>{
        var wrongId = "abcd3";
        request(app)
            .delete(`/record/record/${wrongId}`)
            .expect(400)
            .end(done);
    });
});

describe('PATCH /record/:id',()=>{
    it('should update the record', (done)=>{
        var recordid = records[1].recordid;
        request(app)
            .patch(`/record/record/${recordid}`)
            .send({
                senderid: null,
                receiverid: records[2].receiverid,
                cardid: null,
                expireDate: null,
                cardContent: null,
                cardTitle: null,
                status: 5,
                title: messages[2].title,
                msgContent: messages[2].msgContent
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.cardTitle).toBe("movie invitation");
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                models.Record.findAll({ where: { recordid: recordid }, raw : true }).then((res)=>{
                    expect(res[0].finishDate).toBeTruthy();
                }).catch((e)=>done(e));  
                models.Message.findAll({ where: { title: messages[2].title }, raw : true }).then((message)=>{
                    expect(message.length).toBe(1);
                    expect(message[0].title).toBe(messages[2].title);
                    done();
                }).catch((e)=>done(e)); 
            });
    });
});

