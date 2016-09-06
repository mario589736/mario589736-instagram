'use strict';

/**
 * Auth methods
 */

authorizeUser = function authorizeUser(code, cb) {
    check(arguments, [Match.Any]);

    var ig = instagramNode.instagram();
    ig.use({
        client_id: ig_config.client_id,
        client_secret: ig_config.client_secret
    });
    ig.authorize_user(code, ig_config.redirect_uri, function (err, res) {
        if (err)
        //		console.log(err)
            cb && cb(err, null);
        if (res) cb && cb(null, res);
    });
};

Meteor.methods({
    setAccessToken: function setAccessToken(token, userId) {
        check(arguments, [Match.Any]);
        var id = Meteor.users.update(userId, {
            $set: { 'services.instagram.accessToken': token }
        });
        return id;
    },
    getAccessToken: function getAccessToken(userId) {
        check(arguments, [Match.Any]);

        var user = Meteor.users.findOne(userId);
        if (user) return user.services.instagram.accessToken;
        return false;
    },
    getRoute: function getRoute() {
        if (ig_config && ig_config.redirect_uri) {
            var parts = ig_config.redirect_uri.split('/');
            var path = parts[parts.length - 1];
            return '/' + path;
        }
        return false;
    },
    getAuthUrl: function getAuthUrl() {
        var ig = instagramNode.instagram();
        ig.use({
            client_id: ig_config.client_id,
            client_secret: ig_config.client_secret
        });
        if (ig_config && ig_config.redirect_uri) return ig.get_authorization_url(ig_config.redirect_uri, ig_config.scope);
    },
    authorizeUser: function (code, userId) {
        check(arguments, [Match.Any]);

        let authorizeUserAsync = Meteor.wrapAsync(authorizeUser);
        try {
            authorizeUserAsync(code, function (err, res) {
                if(res) {
                    if(res.access_token) {
                        const token = res.access_token;
                        Meteor.call('setAccessToken', token, userId, function(err, res) {
                            console.log('setAccessToken', res);
                        })
                    }
                }
            })

        }
        catch(e) {
            var error = e.toString();
            throw new Meteor.Error(500, error);
        }
    },
    getConfig: function getConfig() {
        return ig_config ? true : false;
    },
    setServiceConfig: function setServiceConfig() {
        if (ig_config && ig_config.client_id && ig_config.client_secret) {
            ServiceConfiguration.configurations.update({service: 'instagram'}, {
                $set: {
                    scope: ig_config.scope,
                    clientId: ig_config.client_id,
                    secret: ig_config.client_secret
                }
            });
            return true;
        }
    }
});