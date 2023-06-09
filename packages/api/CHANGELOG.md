# @isildur-testing/api

## 0.3.0

### Minor Changes

- 4e773f2: Changed name for discoverAllTests to discover and runAllTests to run, implemented setting a set of standard test runner options, and custom test runner options
- 269d531: Implemented passing a config file location to runner methods, exported all interfaces

## 0.2.1

### Patch Changes

- 4dfccee: Changed typing for BaseTestSuite to contain an array of BaseTestSuites

## 0.2.0

### Minor Changes

- b7d8985: Added method for discovering all tests

## 0.1.0

### Minor Changes

- 783ab23: Added API definition for test runner implementations, added API definition for running all tests, and added TestSuite and TestResult interfaces

### Patch Changes

- 08f03ed: add basic implementation for Isildur class, rename Isildur class interface to IsildurClass, add TestRunner type
- f855919: Extracted core Isildur class interface, renamed IsildurClass interface to IsildurTestRunner
- c9ef086: Removed totalTodo statistic from TestSuite interface
- d76ea58: remove initial testing functions, add API interface definition for main Isildur class and running all tests, add definition for test results

## 0.0.2

### Patch Changes

- added private to package.json in eslint-config-custom and ui, changed name of @isildur-testing/api

## 0.0.1

### Patch Changes

- dff3a87: initial setup, added add and sub functions
