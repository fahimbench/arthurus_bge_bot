var glob = require('glob')
    , path = require('path');

exports.start = (controller) => {
    console.log('-- Chargement des hears --\n')
    glob.sync('./src/callAction/hears/*.js').forEach(function (file) {
        try {
            require(path.resolve(file))(controller);
            console.log(file + ' chargés !');
          } catch (e) {
            console.log(file + ' n\'as pas pu être chargé !');
          }
    });
    console.log('\n');
}