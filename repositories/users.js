const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const Repository = require("./repository");

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {

  // overwrite create
  async create(userData) {
    userData.id = this.generateId();
    const salt = crypto.randomBytes(8).toString("hex");
    const derivedKey = await scrypt(userData.password, salt, 64);
    const users = await this.getAll();
    const newUser = {
      ...userData,
      password: `${derivedKey.toString("hex")}.${salt}`,
    };
    users.push(newUser);
    await this.writeAll(users);
    return newUser;
  }

  // add comparePasswords
  async comparePasswords(savedPass, suppliedPass) {
    const [hashed, salt] = savedPass.split(".");
    const derivedKey = await scrypt(suppliedPass, salt, 64);
    const hashedSupplied = derivedKey.toString("hex");
    return hashed === hashedSupplied;
  }
}

module.exports = new UsersRepository("users.json");
