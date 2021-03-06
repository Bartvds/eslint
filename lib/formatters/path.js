/**
 * @fileoverview Compact reporter
 * @author Nicholas C. Zakas
 */

/*jshint node:true*/

//------------------------------------------------------------------------------
// Helper Functions
//------------------------------------------------------------------------------

function getMessageType(message, rules) {

    if (message.fatal || rules[message.ruleId] === 2) {
        return "Error";
    } else {
        return "Warning";
    }

}


//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function (results, config) {

    var output = "",
        total = 0,
        rules = config.rules || {},
        path = require("path"),
        dataUrlPrefix = "data:application/json;base64,";

    results.forEach(function(result, index) {

        var messages = result.messages;
        total += messages.length;

        if (index > 0) {
            output += "\n";
        }
        output += ">> " + result.filePath + "\n";

        messages.forEach(function(message) {

            output += getMessageType(message, rules).toLocaleUpperCase() + " at ";
            if (message.filePath.slice(0, dataUrlPrefix.length).toLowerCase() === dataUrlPrefix) {
                output += message.filePath;
            }
            else {
                output += path.resolve(message.filePath);
            }
            output += "[" + message.line + "," + message.column + "]";
            output += "\n[" + message.ruleId + "] " + message.message + "\n";
        });

    });

    output += "\n" + total + " " + (total === 1 ? "problem" :"problems");

    return output;
};
