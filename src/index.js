const axios = require('axios');
const protobuf = require("protobufjs");
const qs = require('qs');

const BASE_API_URL = 'https://api.budgetbakers.com/ribeez';

class Wallet {
    async login({
        username = process.env.BUDGETBACKERS_WALLET_USERNAME,
        password = process.env.BUDGETBACKERS_WALLET_PASSWORD,
    } = {}) {
        const res = await axios.post(`${BASE_API_URL}/auth/authenticate/userpass`, qs.stringify({
            username: username,
            password: password,
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        this.cookies = res.headers["set-cookie"]
    };

    async listImports() {
        const res = await axios.get(`${BASE_API_URL}/ribeez/import/v1/all`, {
            headers: {
                cookie: this.cookies,
            },
            responseType: 'arraybuffer',
        })
        const root = await protobuf.load(__dirname + '/messages.proto');
        const Imports = root.lookupType("wallet.budgetbakers.Imports")
        const message = Imports.decode(new Uint8Array(res.data));
        return Imports.toObject(message).files
    }

    async deleteImport(fileId) {
        await axios.delete(`${BASE_API_URL}/ribeez/import/v1/delete/item/${encodeURIComponent(fileId)}`, {
            headers: {
                'Cookie': this.cookies.join('; ')
            },
        })
    }
}

module.exports.Wallet = Wallet;