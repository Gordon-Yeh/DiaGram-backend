var env;

function init() {
    var nodeEnv = process.env;
    env = {};

    env.ENV = nodeEnv.ENV;
    if (['development', 'production'].indexOf(env.ENV) == -1) {
        env.ENV = 'development';
    }

    if (!nodeEnv.DB_ROUTE) {
        env.DB_ROUTE = 'test';
    }  else {
        env.DB_ROUTE = nodeEnv.DB_ROUTE;
    }

    env.PORT = {
        production:  80,
        development: 3000,
    }[env.ENV];

    env.DB_URL = `mongodb+srv://${nodeEnv.DB_NAME}:${nodeEnv.DB_PASS}@cluster0-k8yai.mongodb.net/${env.DB_ROUTE}?retryWrites=true`;
    
    return env;
}

function get() {
    if (!env) init();
    return env;
}

module.exports = {
    get,
};