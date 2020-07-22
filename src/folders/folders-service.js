const FoldersService = {
  getAllFolders(db) {
    return db.select("*").from("noteful_folders");
  },
  getFolder(db, id) {
    return db
      .select("*")
      .from("noteful_folders")
      .where("id", id)
      .first();
  },
  createFolder(db, folder) {
    return db
      .insert(folder)
      .into("noteful_folders")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  updateFolder(db, id, updateFields) {
    return db
      .select("*")
      .from("noteful_folders")
      .where("id", id)
      .update(updateFields);
  },
  deleteFolder(db, id) {
    return db
      .select("*")
      .from("noteful_folders")
      .where("id", id)
      .delete();
  },
};

module.exports = FoldersService;
