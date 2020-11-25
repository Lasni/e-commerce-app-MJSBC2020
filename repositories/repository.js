const fs = require("fs");
const crypto = require("crypto");

module.exports = class Repository {
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

  async create(attrs) {
    attrs.id = this.generateId();
    const records = await this.getAll();
    records.push(attrs);
    await this.writeAll(records);

    return attrs;
  }

  generateId() {
    return crypto.randomBytes(4).toString("hex");
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf-8",
      })
    );
  }

  async getOneBy(filters) {
    const records = await this.getAll();
    // iterating over an array
    for (let record of records) {
      let found = true;
      // iterating over an object
      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }
      if (found) {
        return record;
      }
    }
  }

  async writeAll(records) {
    await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  async update(id, update) {
    const records = await this.getAll();
    const recordToUpdate = records.find((record) => record.id === id);

    if (!recordToUpdate) {
      throw new Error(`Record with id ${id} doesn't exist`);
    }

    Object.assign(recordToUpdate, update);
    await this.writeAll(records);
  }
};
