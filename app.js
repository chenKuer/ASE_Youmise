require('./config');

// [Start app]
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const models = require('./models');
const bodyParser = require('body-parser');
const cors = require("cors");

const users = require('./routes/users');
const cards = require('./routes/cards');
const records = require('./routes/records');
const friends = require('./routes/friends');
const messages = require('./routes/messages');
const authUser =  require('./routes/authenticate');

// var {authenticate} = require('./middleware/authenticate');

var app = express();


app.use(cors())
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(express.static(path.join(`${__dirname}/umise/dist`)));

app.use('/user', users);
app.use('/card', cards);
app.use('/record', records);
app.use('/friend', friends);
app.use('/message', messages);
app.use('/authUser', authUser);

app.use('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/umise/dist/index.html`));
});

const PORT = process.env.PORT || 8080;

(async () => {
  try {
    await models.sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch(err) {
    console.error('Unable to connect to the database:', err);
  };
await models.sequelize.sync();

// await models.sequelize.sync({force: true});
  
//   if(process.env.NODE_ENV !== "test"){
//     await models.Card.create({
//       types: 1,
//       cardName: 'Drink Card',
//       cardImgURL: 'https://s3.us-east-2.amazonaws.com/umisefrontendimages/Drink_Card.png',
//       cardNote: 'I promise I\'ll buy you a drink next time! Let\'s find a fun place!',
//     });

//     await models.Card.create({
//         types: 1,
//         cardName: 'Warning Card',
//         cardImgURL: 'https://s3.us-east-2.amazonaws.com/umisefrontendimages/Warning_Card.png',
//         cardNote: 'Warning!',
//     });

//     await models.Card.create({
//         types: 2,
//         cardName: 'Gift Card',
//         cardImgURL: 'https://s3.us-east-2.amazonaws.com/umisefrontendimages/Gift_Card.png',
//         cardNote: 'This is a sincere gift for you. Wish you happy every day!',
//     });
//     await models.Card.create({
//         types: 2,
//         cardName: 'Bank Card',
//         cardImgURL: 'https://s3.us-east-2.amazonaws.com/umisefrontendimages/Bank_Card.png',
//         cardNote: 'I promise I\'ll return the money to you.',
//     });
//     await models.Card.create({
//         types: 1,
//         cardName: 'Chance Card',
//         cardImgURL: 'https://s3.us-east-2.amazonaws.com/umisefrontendimages/Chance_Card.jpg',
//         cardNote: 'I promise I\'ll give you another chance.',
//     });
//     await models.Card.create({
//         types: 1,
//         cardName: 'Run Errand Card',
//         cardImgURL: 'https://s3.us-east-2.amazonaws.com/umisefrontendimages/Run_Errand_Card.jpg',
//         cardNote: 'I promise I\'ll run an errand for you!',
//     });
//     await models.Card.create({
//         types: 1,
//         cardName: 'Rely Card',
//         cardImgURL: 'https://s3.us-east-2.amazonaws.com/umisefrontendimages/Rely_Card.png',
//         cardNote: 'I promise I will offer you a help in the future.',
//     });
//     await models.Card.create({
//         types: 1,
//         cardName: 'Unconditional Helping Card',
//         cardImgURL: 'https://s3.us-east-2.amazonaws.com/umisefrontendimages/Unconditional_+Helping_Card.jpg',
//         cardNote: 'I Promise that I went ever you ask me to do something that I can do, and which will not hurt others, I will complete the mission unconditionally',
//     });
//     await models.Card.create({
//         types: 1,
//         cardName: 'Dating Card',
//         cardImgURL: 'https://s3.us-east-2.amazonaws.com/umisefrontendimages/Date_Card.jpeg',
//         cardNote: 'I promise I will date with you next time.',
//     });
//     await models.Card.create({
//         types: 1,
//         cardName: 'Gossip Card',
//         cardImgURL: 'https://s3.us-east-2.amazonaws.com/umisefrontendimages/Gossip_Card.jpg',
//         cardNote: 'You are my best friend~ I promise I will share with you my little secret.',
//     });
//     await models.Card.create({
//         types: 2,
//         cardName: 'Girlfriends Card',
//         cardImgURL: 'https://s3.us-east-2.amazonaws.com/umisefrontendimages/Girlfriends_Card.jpg',
//         cardNote: 'I promise I will be your best friend.',
//     });
//     await models.Card.create({
//         types: 1,
//         cardName: 'Game Card',
//         cardImgURL: 'https://s3.us-east-2.amazonaws.com/umisefrontendimages/Game_Card.png',
//         cardNote: 'I promise I will play games with you for a day. I will stay by your side all the time.',
//     });
//     await models.Card.create({
//         types: 1,
//         cardName: 'Friendzoned Card',
//         cardImgURL: 'https://s3.us-east-2.amazonaws.com/umisefrontendimages/Friendzoned_Card.jpg',
//         cardNote: 'I promise I will be your friends forever!',
//     });

//     await models.Card.create({
//       types: 1,
//       cardName: "A Pretty Day",
//       cardImgURL: "https://s3.us-east-2.amazonaws.com/umisefrontendimages/pink.jpg",
//       cardNote: "I Promise I will stay with you all the day. Whenever you need me, I will always be with you by your side. If you want me to stay with you, just give me the signal!"
//     });

//     await models.Card.create({
//       "types": 1,
//       "cardName": "Study Day",
//       "cardImgURL": "https://s3.us-east-2.amazonaws.com/umisefrontendimages/dash.jpg",
//       "cardNote": "I Promise I will stay with you all the day for studying. Whenever you need me, I will always be with you by your side."
//     });

//     await models.Card.create({
//       "types": 1,
//       "cardName": "Treat Me",
//       "cardImgURL": "https://s3.us-east-2.amazonaws.com/umisefrontendimages/monster.png",
//       "cardNote": "I promise I will treat you a big dinner."
//     });

//     // models.User.findOne().then(user => {
//     //   console.log(user.get('username'));
//     // });
//     // models.User.create({
//     //   username: 'xyh',
//     //   email: 'candice@gmail.com'
//     // });
//     // models.User.create({
//     //   username: 'xyh101',
//     //   email: 'candice101@gmail.com'
//     // });
//     // models.User.create({
//     //   username: 'xyh102',
//     //   email: 'candice102@gmail.com'
//     // });
//   }

})();

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }
  console.log(`Listening ${PORT}`);
});


module.exports = {app};
