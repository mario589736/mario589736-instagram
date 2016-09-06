# Instagram API
Uses the `ostrio:instagram-node` package to get data from the instagram api via meteor method calls.

## Installation
`$ meteor add heaven7:instagram`

## Prerequisites

You need an [instagram account] (https://www.instagram.com/).
On the [developer page] (https://www.instagram.com/developer/clients/manage/) register a new
client to get the `client_id` and `client_secret`, also a `redirect_uri` is needed. 

You will need some existing authentication system in your app (e.g. `accounts-base` and `accounts-password`).

## Configuration
On the server make a file with the following content
```javascript
  Meteor.startup(function () {
    ig_config = {
      client_id: '<client_id>',				// required
      client_secret: '<client_secret>',		// required  
      redirect_uri: '<redirect_uri>',		// required
      scope: {
        scope: ['basic', 'public_content'], // optional
        state: 'mystate'					// optional
      }
    }
  })
```
The ig_config object should be in a startup function to work properly.

## Authentication
This package currently supports the 'Server-side (Explicit) Flow' of instagram only.

In your template place the `auth_url` helper in a link or button
```html
<template name="mytemplate">
  <a href="{{auth_url}}">Authenticate with instagram</a>
</template>
```
After a user has clicked on the link, the user will be redirected to let him authenticate against your app.
You can see if a user was successfully authenticated by looking into the instagram service of the user.
Type in your browser console
```javascript
Meteor.user().services.instagram
```
should show the access token. Something like
```javascript
Object {accessToken: "3035947344.aee9283.53fe981b5b98445da7ff425d3949ddee"}
```

## User data

### Followers count
You can get the instagram followers count of the user by
```html
<template name="mytemplate">
  FollowersCount: {{user_followers_count}}
</template>
```
or with the meteor method
```javascript
Meteor.call('getUserFollowersCount', userId, (err, res) => {
	console.log(err, res)
	// do something with the error and result
})
```

### User media
Get the list of recent media published by the user.
https://www.instagram.com/developer/endpoints/users/#get_users_media_recent
```javascript
// optional options object
let options = { 
	count,
    max_timestamp,
    min_timestamp,
    max_id,
    min_id
}

Meteor.call('getUserMedia', userId, options, (err, res) => {
	// do something with the error and result
})
```

### User liked media
Get the list of recent media liked by the user
https://www.instagram.com/developer/endpoints/users/#get_users_feed_liked
```javascript
// optional options object
let options = { 
	count, 
	max_like_id  
}

Meteor.call('getUserMediaLiked', userId, options, (err, res) => {
	// do something with the error and result
})
```



