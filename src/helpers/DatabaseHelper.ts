import sqlite from "sqlite3";

class DBHelper {
  dbFilePath = "names.db";
  db: sqlite.Database;

  constructor(){
    this.db = new sqlite.Database(this.dbFilePath, err => {
      if (err) {
        console.error("Error connecting to the database", err);
      } else {
        console.log("Connected to the database");
      }
    });
  }
}

export default DBHelper;
