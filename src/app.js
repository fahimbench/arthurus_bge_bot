let hears = require('./callAction/hearsCall');
let cron = require('./callAction/cronCall');
let listeners = require('./callAction/listenersCall')

exports.start = (controller, bot) => {

    hears.start(controller);
    cron.start(controller, bot);
    listeners.start(controller);

}
