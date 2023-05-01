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