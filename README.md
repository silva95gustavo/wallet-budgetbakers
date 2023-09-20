# wallet-budgetbakers

[![npm version](https://badge.fury.io/js/wallet-budgetbakers.svg)](https://badge.fury.io/js/wallet-budgetbakers)

This is a Node.js client for the Wallet (by BudgetBakers) personal finance app unofficial API. It allows you to:

- Login
- List import files  
- Upload import files
- Delete import files

## Installation

With npm:
```bash
npm install wallet-budgetbakers
```

With yarn:
```bash
yarn add wallet-budgetbakers
```

## Usage 

```js
import { login } from 'wallet-budgetbakers';

const wallet = await login({
  username: 'me@example.com',
  password: 'mypassword' 
});

const files = await wallet.listImports(); 

await wallet.uploadFile({
  filePath: 'data.csv',
  importEmail: 'foobar@imports.budgetbakers.com'
});

await wallet.deleteImport(fileId);
```

The `login` function returns a `WalletSession` instance that handles authentication and provides methods to interact with the BudgetBakers API.

## API

### `login(options)`

Logs in and returns a `WalletSession`.

Options:

- `username` - BudgetBakers username  
- `password` - BudgetBakers password

### `WalletSession`

#### `listImports()`

Gets a list of import files. Returns an array of `File` objects. 

#### `uploadFile(options)` 

Uploads a file to BudgetBakers.

Options:

- `filePath` - Local file path to upload
- `importEmail` - BudgetBakers account email

#### `deleteImport(fileId)`  

Deletes an import file by ID.
