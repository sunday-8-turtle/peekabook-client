module.exports = {
  pwa: {
    name: 'Peekabook',
    workboxOptions: {
      exclude: ['_redirects'],
    },
  },
  // chainWebpack: (config) => {
  //   config.plugins.delete('pwa');
  //   config.plugins.delete('workbox');
  // },
};
