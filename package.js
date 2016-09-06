Package.describe({
  name: 'heaven7:instagram',
  version: '0.0.2',
  summary: 'API wrapper package to retreive user data from instagram',
  git: 'https://github.com/heaven7/instagram.git',
  documentation: 'README.md'
})

var both = ['client','server'],
    packages = [
        'ostrio:instagram-node@0.5.8',
        'bozhao:accounts-instagram@0.1.2',
        'service-configuration',
        'http',
        'tracker',
        'session',
        'templating',
        'reactive-var',
        'es5-shim',
        'ecmascript',
        'jquery'
]

Package.onUse(function(api) {
    api.versionsFrom("1.2")
    api.use(packages, both)
    api.imply(packages)

    api.addFiles([
      'lib/both/router.js'
    ], both)

    api.addFiles([
        'lib/client/templates.js',
    ], 'client')

    api.addFiles([
      'lib/server/methods.js',
      'lib/server/users.js',
      'lib/server/accounts.js'
    ], 'server')
})