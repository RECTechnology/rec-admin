const ENV = {
  local: true,
  build_tag: "__build_tag__",
  git_desc: "__git_desc__",
  name: 'beta',
  default_config: 'beta',
  configurations: {
    beta: {
      client_id: "39_5zil0e2m6zs4s4o8ooo0w4gkk84ckssgggssgck08cwcgccwoo",
      client_secret: "2y2vi2ibmhkw8gc4wcs0os8sg4kk4wocs4kwwkcwcwgkkooc4s",
      url: 'https://api.chip-chap.com',
      production: true,
      beta: true
    },
    pre: {
      client_id: "2_2lp3pc9wv1esogs4k4sc8ko880sw4soswoo8wgsoc8kkw804o4",
      client_secret: "4xoukdqzhbwgc4w4cgks8c4owwo8g88oowk4oo4gkg4wcgsggc",
      url: 'https://pre-api.chip-chap.com'
    },
    sandbox: {
      client_id: "18_3ve25poy9nwgckss0sgs4w0wosc80o8s4kw8sckw4sowc4o4co",
      client_secret: "ws3g754va1c88cs04k8c8kkogggkk0sswws4w0sko44scwwo4",
      url: 'https://sandbox.chip-chap.com'
    },
    prod: {
      client_id: "46_581wbvob9aoscw80880ck8kw4wc0sc4ss4c80g0kg04ssc0kco",
      client_secret: "4g9e3zm8nv6sc8wg4g44gss4g4o88kc0ssw08kso4gwos48ow8",
      url: 'https://api.chip-chap.com',
      production: true
    }
  },
  disabled_features: [
    'TradingModule'
  ],
  getConfig: (name) => {
    return ENV.configurations[name] || ENV.configurations[ENV.default_config];
  }
}

module.exports = ENV;