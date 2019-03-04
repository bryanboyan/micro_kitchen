module.exports = {
  transform: {
    "^.+\\.js?$": "babel-jest"
  },
  transformIgnorePatterns: [],
  modulePathIgnorePatterns: ["<rootDir>/app/"],
  setupFiles: ["<rootDir>/test/setup.js"],
};
