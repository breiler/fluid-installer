module.exports = {
    transform: {
        "^.+\\.(ts|tsx)?$": "ts-jest",
        "^.+\\.(js|jsx)$": "babel-jest"
    },
    testRegex: "src/__test__/.*\\.(test|spec)\\.(ts|tsx|js|jsx)$"
};
