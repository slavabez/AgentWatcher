import sqlite from "sqlite3";

interface PathToName {
  path: string;
  name?: string;
  id?: number;
}

class DBHelper {
  dbFilePath;
  db: sqlite.Database;

  constructor(filePath = "names.db") {
    this.dbFilePath = filePath;
    this.db = new sqlite.Database(this.dbFilePath, err => {
      if (err) {
        console.error("Error connecting to the database", err);
      }
    });
  }

  async initialiseTables() {
    const query = `
    CREATE TABLE IF NOT EXISTS names (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL UNIQUE,
      name TEXT
    )
    `;
    try {
      await this.runQuery(query);
    } catch (e) {
      console.error(`Error initiating the names table`);
    }
  }

  runQuery(query, params = []): Promise<number | string | null> {
    return new Promise((resolve, reject) => {
      // Notice lack of ES6 arrow function in favour of 'function' to create this context inside the function
      this.db.run(query, params, function(err) {
        if (err) reject(err);
        if (this.lastID) resolve(this.lastID);
        if (this.changes) resolve(this.changes);
        resolve();
      });
    });
  }

  async addName(data: PathToName) {
    try {
      if (!data.name) data.name = data.path;
      return await this.runQuery(
        `INSERT INTO names (path, name) VALUES (?, ?);`,
        [data.path, data.name]
      );
    } catch (e) {}
  }

  async updateName(data: PathToName) {
    try {
      if (!data.id) {
        console.error("No ID of the name to update specified");
        return;
      }
      return await this.runQuery(
        `UPDATE names SET path = ?, name = ? WHERE id = ?;`,
        [data.path, data.name, data.id]
      );
    } catch (e) {
      console.error(`Failed to update a name`, e);
    }
  }

  async deleteName(id: number) {
    try {
      return await this.runQuery(`DELETE FROM names WHERE id = ?`, [id]);
    } catch (e) {
      console.error(`Failed to delete a name`, e);
    }
  }

  getAllNames() {
    try {
      return new Promise((resolve, reject) => {
        this.db.all(`SELECT * FROM names`, (err, results) => {
          if (err) reject(err);
          resolve(results);
        });
      });
    } catch (e) {
      console.error(`Failed to get all names`, e);
    }
  }

  getNameById(id: number) {
    try {
      return new Promise((resolve, reject) => {
        this.db.get(`SELECT * FROM names WHERE id = ?`, [id], (err, res) => {
          if (err) reject(err);
          resolve(res);
        });
      });
    } catch (e) {
      console.error(`Error getting specific name by ID`, e);
    }
  }

  getNameByPath(path: string) {
    try {
      return new Promise((resolve, reject) => {
        this.db.get(
          `SELECT * FROM names WHERE path = ?`,
          [path],
          (err, res) => {
            if (err) reject(err);
            resolve(res);
          }
        );
      });
    } catch (e) {
      console.error(`Error getting specific name by path`, e);
    }
  }

  async addBulkPaths(paths: string[]) {
    const promises = [];
    paths.forEach(p => {
      promises.push(this.addName({ path: p, name: p }));
    });

    await Promise.all(promises).catch(err => {
      console.error(err);
    });
  }

  stop() {
    return new Promise((resolve, reject) => {
      this.db.close(err => {
        if (err) reject(err);
        resolve();
      });
    });
  }
}

export default DBHelper;
