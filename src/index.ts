import axios from "axios";
import protobuf from "protobufjs";
import qs from "qs";
import fs from "fs";
import path from 'path'
import { File, User } from "./types"

const BASE_API_URL = "https://api.budgetbakers.com";

class WalletSession {
  cookies?: string[];

  constructor({
    cookies
  }: {
    cookies?: string[]
  }) {
    this.cookies = cookies
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

  async getCurrentUser(): Promise<User> {
    const res = await axios.get(`${BASE_API_URL}/ribeez/user/abc`, {
      headers: {
        cookie: this.cookies,
        Platform: "web",
        "Web-Version-Code": "4.16.1",
      },
      responseType: 'arraybuffer'
    });

    const root = await protobuf.load(__dirname + "/messages.proto");

    const user = root.lookupType("wallet.budgetbakers.User")
    const message = user.decode(new Uint8Array(res.data));
    return user.toObject(message) as User;
  }

  async listImports(): Promise<File[]> {
    const res = await axios.get(`${BASE_API_URL}/ribeez/import/v1/all`, {
      headers: {
        cookie: this.cookies,
        Platform: "web",
        "Web-Version-Code": "4.16.1",
      },
      responseType: "arraybuffer",
    });
    const root = await protobuf.load(__dirname + "/messages.proto");
    const Imports = root.lookupType("wallet.budgetbakers.Imports");
    const message = Imports.decode(new Uint8Array(res.data));
    return Imports.toObject(message).files;
  }

  async uploadFile({
    filePath,
    importEmail,
  }: {
    filePath: string;
    importEmail: string;
  }) {
    const currentUser = await this.getCurrentUser();

    await axios.post(`https://docs.budgetbakers.com/upload/import-web/${encodeURIComponent(importEmail)}`, fs.readFileSync(filePath, 'utf8'), {
      headers: {
        'content-type': 'text/csv',
        'x-filename': path.basename(filePath),
        'x-userid': currentUser.id,
      }
    });
  }
}

const login = async function ({
  username,
  password
}: {
  username: string;
  password: string;
}) {
  const res = await axios.post(
    `${BASE_API_URL}/auth/authenticate/userpass`,
    qs.stringify({
      username: username,
      password: password,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    }
  );
  return new WalletSession({
    cookies: res.headers["set-cookie"]
  })
}

export { login };
