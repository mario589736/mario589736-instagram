'use strict';

Handlebars.registerHelper('auth_url', function () {
    Meteor.call('getAuthUrl', function (err, res) {
        if (err) console.log(err);

        if (res) Session.set('auth_url', res);
    });
    return Session.get('auth_url');
});

Handlebars.registerHelper('user_data', function () {
    Meteor.call('userData', Meteor.userId(), function (err, res) {
        if (err) console.log(err);

        if (res) Session.set('user_data', res);
    });
    return Session.get('user_data');
});

Handlebars.registerHelper('user_followers_count', function () {
    Meteor.call('getUserFollowersCount', Meteor.userId(), function (err, res) {
        if (err) console.log(err);

        if (res || res == 0) Session.set('user_followers_count', res);
    });
    return Session.get('user_followers_count');
});