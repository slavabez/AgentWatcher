import "jest";
import uniqid from "uniqid";
import del from "del";
import DBH from "../helpers/DatabaseHelper";

describe(`Functional tests for CRUD operations`, () => {
  let uniqueDb: string;
  let dbh: DBH;

  beforeEach(async () => {
    uniqueDb = uniqid();
    dbh = new DBH();
    await dbh.initialiseTables();
  });

  afterEach(async () => {
    await dbh.stop();
    // Delete the file
    await del(dbh.dbFilePath, { force: true });
  });

  test("Insert 2 names, verify we get incrementing IDs back", async () => {
    const result = await dbh.addName({ path: "path", name: "Игра" });
    expect(result).toBe(1);

    const result2 = await dbh.addName({ path: "path2", name: "Имя 2" });
    expect(result2).toBe(2);
  });

  test("Inserting with non-unique is ignored", async () => {
    const result = await dbh.addName({ path: "path", name: "Игра" });
    expect(result).toBe(1);

    await dbh.addName({ path: "path", name: "Имя 2" });
    const all = await dbh.getAllNames();
    expect(all).toHaveLength(1);
  });

  test("GetAll works", async () => {
    await dbh.addName({ path: "path1", name: "Игра1" });
    await dbh.addName({ path: "path2", name: "Игра2" });
    await dbh.addName({ path: "path3", name: "Игра3" });
    await dbh.addName({ path: "path4", name: "Игра4" });

    const all = await dbh.getAllNames();
    expect(all).toHaveLength(4);
    expect(all[0].id).toBe(1);
    expect(all[3].id).toBe(4);
    expect(all[0].path).toBe("path1");
    expect(all[3].name).toBe("Игра4");
  });

  test("GetOne and Update works", async () => {
    const id1 = await dbh.addName({ path: "path1", name: "Игра1" });
    expect(id1).toBeTruthy();

    const get1 = await dbh.getNameById(+id1);
    expect(get1).toEqual({
      id: id1,
      path: "path1",
      name: "Игра1"
    });

    const changed1 = await dbh.updateName({
      id: +id1,
      name: "Игра2"
    });
    expect(changed1).toBe(id1);

    // Path cannot be changed
    const get2 = await dbh.getNameById(+id1);
    expect(get2).toEqual({
      id: +id1,
      path: "path1",
      name: "Игра2"
    });
  });

  test("Get by path works", async () => {
    await dbh.addName({ path: "path1", name: "Игра1" });
    await dbh.addName({ path: "path2", name: "Игра2" });
    const id = await dbh.addName({ path: "path3", name: "Игра3" });
    await dbh.addName({ path: "path4", name: "Игра4" });

    const n = await dbh.getNameByName("path3");
    expect(n).toEqual({
      id: id,
      path: "path3",
      name: "Игра3"
    });
  });

  test("Add Bulk paths works", async () => {
    const paths = ["path1", "path2", "path3", "path4", "path5", "path6"];
    await dbh.addBulkPaths(paths);

    const all = await dbh.getAllNames();
    expect(all).toHaveLength(paths.length);
    // Name should be same as path
    expect(all[3].name).toBe(all[3].path);
  });

  test("Add bulk doesn't crash when duplicates are added, skips duplicates", async () => {
    const paths = ["path1", "path2", "path2", "path1", "path5", "path6"];
    await dbh.addBulkPaths(paths);

    const all = await dbh.getAllNames();
    // Should only have 4 items
    expect(all).toHaveLength(4);
  });
});
