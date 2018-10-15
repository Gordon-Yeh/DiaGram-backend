function setup() {
    var nodeEnv = process.env;
    var env = {};

    env.ENV = nodeEnv.ENV;
    if (['development', 'production'].indexOf(env.ENV) == -1) {
        env.ENV = 'development';
    }

    env.PORT = {
        production:  80,
        development: 3000,
    }[env.ENV];
    
    return env;
}

module.exports = {
    setup,
};