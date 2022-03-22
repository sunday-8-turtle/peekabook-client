// Vue Meta 전환 필요
module.exports = {
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = '피카북';
      return args;
    });
  },
};
