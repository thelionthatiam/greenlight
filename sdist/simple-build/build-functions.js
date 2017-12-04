"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const prompt = require("prompt");
const fs = require("fs");
prompt.start();
let tableDrop = psqlCommand(["DROP TABLE nonce", "DROP TABLE users"]);
exports.tableDrop = tableDrop;
function applyDefaults(obj) {
    for (let k in obj) {
        if (k === 'database' && obj[k] === '') {
            obj.database = 'formapp';
            console.log(obj[k], "is the database");
        }
        else if (k === 'user' && obj[k] === '') {
            obj.user = 'formadmin';
            console.log(obj[k], "is the user");
        }
        else if (k === 'password' && obj[k] === '') {
            obj.password = 'formpassword';
            console.log(obj[k], "is the password");
        }
        else if (k === 'host' && obj[k] === '') {
            obj.host = 'localhost';
            console.log(obj[k], "is the host");
        }
    }
    return obj;
}
exports.applyDefaults = applyDefaults;
function psqlCommand(array) {
    const command = " --command=";
    let finarr = [];
    for (let i = 0; i < array.length; i++) {
        finarr.push(command);
        array[i] = '"' + array[i] + '"';
        finarr.push(array[i]);
    }
    return finarr.join('');
}
exports.psqlCommand = psqlCommand;
function fileChecker(path) {
    try {
        let file = require(path);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.fileChecker = fileChecker;
function makeJSONfromObj(path, obj) {
    let data = JSON.stringify(obj);
    fs.writeFileSync(path, data);
}
exports.makeJSONfromObj = makeJSONfromObj;
function connectCommand(user, host, database, password) {
    let connectCommand = "PGPASSWORD=" + password +
        " psql" +
        " -U " + user +
        " -h " + host +
        " -d " + database;
    return connectCommand;
}
exports.connectCommand = connectCommand;
function prompter(promptObj, cb) {
    prompt.get(promptObj, function (err, result) {
        if (err) {
            console.log("something went wrong", err);
            cb(err);
        }
        else {
            console.log('prompter completed');
            cb(null, result);
        }
    });
}
exports.prompter = prompter;
function childProcess(string, cb) {
    console.log('step one');
    child_process_1.exec(string, function (error, stdout, stderr) {
        console.log('step two');
        if (error) {
            cb(error);
        }
        else {
            console.log('step three');
            cb(null, stdout, stderr);
        }
    });
}
exports.childProcess = childProcess;
let tablesExist = psqlCommand(["SELECT * FROM users", "SELECT * FROM nonce"]);
exports.tablesExist = tablesExist;
let removeConfig = fs.unlink('../config/connect-config.json', function () { });
exports.removeConfig = removeConfig;
//# sourceMappingURL=build-functions.js.map