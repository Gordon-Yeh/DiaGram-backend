var env;

function init() {
    var nodeEnv = process.env;
    env = {};

    env.ENV = nodeEnv.ENV;
    if (['development', 'production'].indexOf(env.ENV) === -1) {
        env.ENV = 'development';
    }

    env.PORT = {
        production:  80,
        development: 3000,
    }[env.ENV];

    env.DB_URL = nodeEnv.DB_URL;

    return env;
}

function get() {
    if (!env) init();
    return env;
}

module.exports = {
    get,
};
