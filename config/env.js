var env;

function init() {
    var nodeEnv = process.env;
    var DB_USER = 'diagram_server';
    var DB_PW = 'DoctorWho';
    var DB_NAME = 'DiaGramDB';
    env = {};

    env.ENV = nodeEnv.ENV;
    if (['development', 'production'].indexOf(env.ENV) === -1) {
        env.ENV = 'development';
    }

    env.PORT = {
        production:  80,
        development: 3000,
    }[env.ENV];

    env.DB_USER = nodeEnv.DB_USER || 'diagram_server';
    env.DB_PW = nodeEnv.DB_PW || 'DoctorWho';
    env.DB_NAME = nodeEnv.DB_NAME || 'DiaGramDB';
    env.DB_URL = `mongodb+srv://${DB_USER}:${DB_PW}@cluster0-k8yai.mongodb.net/${DB_NAME}?retryWrites=true`;

    return env;
}

function get() {
    if (!env) { init(); }
    return env;
}

module.exports = {
    get,
};
