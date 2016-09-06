'use strict';

if (Meteor.isClient) {
    Tracker.autorun(function () {
        Meteor.call('getConfig', function (err, res) {
            if (res) Meteor.call('setServiceConfig');
        });
        Meteor.call('getRoute', function (err, res) {
            if (res) Session.set('auth_route', res);
        });
        // authorize user and update token everytime the request_uri is hit
        if (Meteor.userId() && window.location.pathname == Session.get('auth_route')) {
            var userId = Meteor.userId();
            var params = window.location.search;
            var regex = new RegExp(/code=[a-z0-9]+/);
            var code = params.match(regex)[0].split('code=')[1];
            if (code) Meteor.call('authorizeUser', code, userId, function (err, res) {
                if (err) console.log(err);
            });
        }
    });
}