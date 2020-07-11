module.exports = {
  webpack: (config, { webpack, isServer }) => {
    // Inject custom polyfills
    const originalEntry = config.entry;
    config.entry = async () => {
      const entries = await originalEntry();
      if (entries['main.js'] && !entries['main.js'].includes('./client/polyfills.js')) {
        entries['main.js'].unshift('./src/polyfills.ts');
      }
      return entries;
    };

    // Add support for importing images
    config.module.rules.push({
      test: /\.(png|jpg|gif)$/i,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192,
            publicPath: '/_next/static/images/',
            outputPath: `${isServer ? "../" : ""}static/images/`,
          },
        },
      ],
    });
    return config;
  },
};
