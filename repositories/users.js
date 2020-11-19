const fs = require("fs");
const crypto = require("crypto");

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

  async createUser(user) {
    user.id = this.generateId();
    const users = await this.getAll();
    users.push(user);

    await this.writeAll(users);
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
