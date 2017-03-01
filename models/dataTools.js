// file: models/dataTools.js

var fs = require('fs');  // Needed for filesystem operations

// file specifies the name of the file to read
// callback is a function
function readJsonFile(file, callback) {
  var obj;
  // Read the file, if successful, the file content is
  // returned in variable data
  fs.readFile(file,'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data); // parse the data
    callback(obj);          // apply the callback function
  });
}

// Export the functions defined within { }
module.exports = {readJsonFile};
