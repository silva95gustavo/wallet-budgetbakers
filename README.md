# wallet-budgetbakers
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
import { Wallet } from 'wallet-budgetbakers';

const wallet = new Wallet();

await wallet.login({
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

The Wallet client handles authentication and provides methods to interact with the BudgetBakers API. 

## API

### `login(options)`

Authenticates with BudgetBakers API.  

Options:

- `username` - BudgetBakers username
- `password` - BudgetBakers password

### `listImports()` 

Gets a list of import files. Returns an array of `File` objects.

### `uploadFile(options)`

Uploads a file to BudgetBakers.  

Options:

- `filePath` - Local file path to upload
- `importEmail` - BudgetBakers account email  

### `deleteImport(fileId)`

Deletes an import file by ID.