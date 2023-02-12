// Craco config file for frontend
module.exports = {
  // Style and CSS config with SASS
  style: {
    sass: {
      loaderOptions: {
        sassOptions: {
          includePaths: ["src/styles"],
        },
      },
    },
  },
  // ESLint config
  eslint: {
    enable: true,
    mode: "extends",
    configure: {
      extends: ["react-app", "react-app/jest"],
      rules: {
        "no-console": "off",
      }
    },
  },
  // Dev server config for proxying to backend
  // and set port to 8081
  // devServer: {
  //   port: 8081,
  //   proxy: {
  //     "/api": {
  //       target: "http://localhost:8080",
  //       secure: false,
  //       changeOrigin: true,
  //     },
  //     onProxyRes: function (proxyRes, req, res) {
  //       console.log(proxyRes.statusCode);
  //     },
  //     onError: function (err, req, res) {
  //       console.log(`req.body: ${req.body}`); // here it returned undefined
  //       console.log(`err.code: ${err.code}`);
  //       if (err.code === 'ECONNRESET') {
  //         res.writeHead(204, { 'Content-Type': 'application/json' });
  //         res.end();
  //       }
  //     },
  //   },
  // },

  // Plugins
  plugins: [
  ],
};
