module.exports = {
  transform: {
    "^.+\\.js?$": "babel-jest"
  },
  transformIgnorePatterns: [],
  setupFiles: ["<rootDir>/test/setup.js"],
};
