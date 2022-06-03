
exports.getDate = function () {
const today = new Date();
const options = {
weekday: "long",
day: "numeric",
month: "long"
};
return day = today.toLocaleDateString("en-us", options);
}

exports.getDay = function() {
const today = new Date();
const options = {
weekday: "long",
};
return day = today.toLocaleDateString("en-us", options);
}
