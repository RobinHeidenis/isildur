# Contribute to Isildur

This is the contribution guide for Isildur.

## Getting Started

## Releasing

Releasing a new version can only be done if you have access to the npm orginization. If you do, you can run the following commands to release a new version:

```sh
pnpm changeset
```

Follow the prompts to create a changeset, and write a descriptive summary of the changes. Commit these changes to the repository, and then run the following command to publish the new version:

```sh
pnpm run publish-packages
```

This will use turborepo to build, lint, and test the packages, followed by consuming all the changesets and publishing the new versions to npm.

You will have to use your npm credentials to publish the packages. If you do not have access to the npm orginization, you can still create changesets, but you will not be able to publish them.

If you have 2FA enabled on your NPM account, you will need to input a code after running the publish command. You can get this code from your authenticator app.

## Creating a new package

To create a new package, follow these steps:

1. Create a new folder in the `packages` directory. The name of the folder should be the name of the package, and should be all lowercase.

2. Create a `package.json` file in the newly made directory. What this looks like depends on if the package is going to be published to NPM.

   1. Private packages

      ```json
      {
        "name": "new-package",
        "main": "src/index.ts",
        "types": "src/index.ts",
        "private": true,
        "dependencies": {
          "typescript": "^5.0.4"
        }
      }
      ```

   2. Public packages
      ```json
      {
        "name": "@isildur-testing/new-package",
        "version": "0.0.0",
        "main": "dist/index.cjs",
        "types": "dist/index.d.ts",
        "module": "dist/index.js",
        "type": "module",
        "files": ["dist/**"],
        "scripts": {
          "build": "tsup-node src/index.ts --format cjs,esm --dts",
          "dev": "npm run build -- --watch",
          "test": "jest"
        },
        "dependencies": {
          "typescript": "^5.0.4",
          "tsup": "^6.7.0",
          "@types/node": "^18.16.3",
          "@types/jest": "^29.5.1",
          "jest": "^29.5.0",
          "jest-preset": "workspace:*",
          "tsconfig": "workspace:*"
        },
        "jest": {
          "preset": "jest-preset"
        }
      }
      ```

3. Create a `src` directory in the package directory, and create an `index.ts` file in it. This is the entrypoint for the package.

4. Create a tsconfig file in the package directory. This is the tsconfig for the package, and should look like this:

   ```json
   {
     "extends": "tsconfig/base.json",
     "compilerOptions": {
       "noEmit": true,
       "paths": {
         "~/*": ["./src/*"]
       },
       "baseUrl": "./"
     }
   }
   ```

5. You can include your package in other package by adding it to the dependency key in the package.json, with a value of `workspace:*`. For example, if you wanted to include the `new-package` package in the `isildur` package, you would add the following to the `isildur` package.json:

   ```json
   {
     "dependencies": {
       "new-package": "workspace:*"
     }
   }
   ```

   This will automatically link the packages together, and allow you to import the `new-package` package from the `isildur` package.

   Don't forget to run `pnpm install` in the root of the repository to install all the new packages and their dependencies.
