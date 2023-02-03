// Craco config file for pm-frontend
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
  devServer: {
    port: 8081,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        secure: false,
        changeOrigin: true,
      },
    },
  },

  // Plugins
  plugins: [
  ],
};
