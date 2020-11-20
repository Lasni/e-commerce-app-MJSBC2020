const fs = require("fs");
const crypto = require("crypto");
const util = require("util");

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating a repository requires a filename");
    }
    this.filename = filename;
    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, "[]");
    }
  }

  generateId() {
    return crypto.randomBytes(4).toString("hex");
  }

  async comparePasswords(savedPass, suppliedPass) {
    const [hashed, salt] = savedPass.split(".");
    const derivedKey = await scrypt(suppliedPass, salt, 64);
    const hashedSupplied = derivedKey.toString("hex");
    return hashed === hashedSupplied;
  }

  async getUser(id) {
    const users = await this.getAll();
    return users.find((user) => user.id === id);
  }

  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf-8",
      })
    );
  }

  async getOneUserBy(filters) {
    const users = await this.getAll();
    // iterating over an array
    for (let user of users) {
      let found = true;
      // iterating over an object
      for (let key in filters) {
        if (user[key] !== filters[key]) {
          found = false;
        }
      }
      if (found) {
        return user;
      }
    }
  }

  async createUser(userData) {
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

  async writeAll(users) {
    await fs.promises.writeFile(this.filename, JSON.stringify(users, null, 2));
  }

  async deleteUser(id) {
    const users = await this.getAll();
    const filteredUsers = users.filter((user) => user.id !== id);
    await this.writeAll(filteredUsers);
  }

  async updateUser(id, update) {
    const users = await this.getAll();
    const userToUpdate = users.find((user) => user.id === id);

    if (!userToUpdate) {
      throw new Error(`User with id ${id} doesn't exist`);
    }

    Object.assign(userToUpdate, update);
    await this.writeAll(users);
  }
}

module.exports = new UsersRepository("users.json");
