# Isildur

## Usage

1. Install the package
   ```bash
   npm install @isildur-testing/core
   ```
2. Write your tests, using mocha or jest
3. Make a runTests script

   ```js
   //@ts-check
   import { Isildur } from "@isildur-testing/core";

   const runner = new Isildur("jest"); // or 'mocha'
   console.time("runAllTests");
   const results = await runner.runAllTests();
   console.timeEnd("runAllTests");

   console.dir(results, { depth: null });
   ```

4. Run the script
   ```bash
   node runTests.js
   ```

### Jest configuration

If you're using jest, you should create a jest.config.js file in the root of your project.

If you're using typescript, you should add the following to your jest.config.js file:

```js
module.exports = {
  roots: ["<rootDir>"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  modulePathIgnorePatterns: [
    "<rootDir>/test/__fixtures__",
    "<rootDir>/node_modules",
    "<rootDir>/dist",
  ],
  preset: "ts-jest/presets/js-with-ts-esm",
};
```

and install the ts-jest package

```bash
npm install -D ts-jest
```

### Mocha configuration

No additional configuration is required for Mocha.
