Meteor.publish("user-info", function(id) {
  return Meteor.users.find({_id: id}, {fields: {username: 1}});
});

headers = {
    list: {},
    get: function(header) {
        return header ? this.list[header] : this.list;
    }
};

var app = typeof WebApp != 'undefined' ? WebApp.connectHandlers : __meteor_bootstrap__.app;
app.use(function(req, res, next) {
    reqHeaders = req.headers;
    return next();
});

Meteor.methods({
    'getReqHeader': function(header) {
        return reqHeaders[header];
    },
    'getReqHeaders': function () {
        return reqHeaders;
    }
});