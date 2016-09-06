'use strict';

/**
 * User methods
 */

getData = function getData(userId, options, functionName, cb) {
    check(arguments, [Match.Any]);

    Meteor.call('getAccessToken', userId, function (err, res) {
        if (res) {
            var token = res;
            var ig = instagramNode.instagram();
            ig.use({
                access_token: token
            });
            options = options || {};
            var ig_func = ig[functionName];
            ig_func(options, cb, function (err, res) {
                if (err)
                //		console.log(err)
                    cb && cb(err, null);
                if (res) cb && cb(null, res);
            });
        }
    });
};

processCall = function processCall(userId, options, functionName) {
    check(arguments, [Match.Any]);

    var getCallAsync = Meteor.wrapAsync(getData);
    try {
        var result = getCallAsync(userId, options, functionName);
        if (result) return result;
    } catch (e) {
        var error = e.toString();
        throw new Meteor.Error(500, error);
    }
};

Meteor.methods({
    'userData': function userData(userId) {
        check(arguments, [Match.Any]);

        var token = Meteor.call('getAccessToken', userId);
        if (token) {
            var url = 'https://api.instagram.com/v1/users/self/?access_token=' + token;
            var result = HTTP.call('GET', url);
            if (result && result.statusCode == 200) {
                return result.data;
            }
        }
    },
    'getUserFollowersCount': function getUserFollowersCount(userId) {
        check(arguments, [Match.Any]);

        var user = Meteor.call('userData', userId);
        if (user && (user.data.counts.followed_by || user.data.counts.followed_by == 0)) return user.data.counts.followed_by;
        return false;
    },
    /**
     * Get the list of recent media liked by the user
     * @param userId {string}
     * @param options object { count,        [opt]
 *                         max_like_id   [opt] }
     * @returns {Array}
     */
    'getUserMediaLiked': function getUserMediaLiked(userId, options) {
        check(arguments, [Match.Any]);

        return processCall(userId, options, 'user_self_liked');
    },
    /**
     * Get the list of recent media published by the user
     * @param userId {string}
     * @param options object { count,           [opt]
    *                         max_timestamp,   [opt]
    *                         min_timestamp,   [opt]
    *                         max_id,          [opt]
    *                         min_id           [opt] }
     * @returns {Array}
     */
    'getUserMedia': function getUserMedia(userId, options) {
        check(arguments, [Match.Any]);

        return processCall(userId, options, 'user_self_media_recent');
    }
});