var cron = require('node-cron');

var glob = require('glob'),
    path = require('path'),
    task = [];

exports.start = (controller, bot) => {
  console.log('-- Chargement des crons --\n');
  glob.sync('./src/callAction/cron/*.js').forEach(function (file, index) {
    try {
    cron.schedule(require(path.resolve(file)).cronplan, () =>  {
      require(path.resolve(file)).func(controller, bot);
       }, {
         scheduled: true,
         timezone: "Europe/Paris"
      });
      console.log(file + ' chargés !');
    } catch (e) {
      console.log(e);
      console.log(file + ' n\'as pas pu être chargé !');
    }

  });
  console.log('\n');
}


// var task = cron.schedule('* * * * * *', () =>  {

//   }, {
//     scheduled: false,
//     timezone: "Europe/Paris"
//   });

// exports.start = () => {console.log("CRON")}


// exports.start = function() { task.start()};
// exports.init = function(controller) {
//     controller.hears(['puree'], 'direct_message, direct_mention, mention', function (bot, message) {
//         bot.replyWithTyping(message, 'HELLOfdfdsfdsfdsfs ?');
// })
// }


// var glob = require('glob')
//     , path = require('path');

// exports.start = (controller) => {
//     console.log("-- Chargement des listeners ! --");
//     glob.sync('./src/hears/**/*.js').forEach(function (file) {
//         require(path.resolve(file))(controller);
//         console.log(file+' chargés !')
//     });
// }

