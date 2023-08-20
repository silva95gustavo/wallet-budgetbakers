import axios from "axios";
import protobuf from "protobufjs";
import qs from "qs";
import { File } from './types'

const BASE_API_URL = "https://api.budgetbakers.com";

class Wallet {
  cookies?: string[];

  async login({
    username = process.env.BUDGETBAKERS_WALLET_USERNAME,
    password = process.env.BUDGETBAKERS_WALLET_PASSWORD,
  } = {}) {
    const res = await axios.post(
      `${BASE_API_URL}/auth/authenticate/userpass`,
      qs.stringify({
        username: username,
        password: password,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    this.cookies = res.headers["set-cookie"];
  }

  async listImports(): Promise<File[]> {
    const res = await axios.get(`${BASE_API_URL}/ribeez/import/v1/all`, {
      headers: {
        cookie: this.cookies,
      },
      responseType: "arraybuffer",
    });
    const root = await protobuf.load(__dirname + "/messages.proto");
    const Imports = root.lookupType("wallet.budgetbakers.Imports");
    const message = Imports.decode(new Uint8Array(res.data));
    return Imports.toObject(message).files;
  }

  async deleteImport(fileId: string) {
    await axios.delete(
      `${BASE_API_URL}/ribeez/import/v1/delete/item/${encodeURIComponent(
        fileId
      )}`,
      {
        headers: {
          Cookie: (this.cookies ?? []).join("; "),
        },
      }
    );
  }
}

export { Wallet };
