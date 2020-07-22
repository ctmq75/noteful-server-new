
const NotesService = {
    getAllNotes(db) {
      return db.select('*').from('noteful_notes');
    },
  
    getNote(db, id) {
      return db
        .select('*')
        .from('noteful_notes')
        .where('id', id)
        .first();
    },
  
    createNote(db, note) {
      return db
        .insert(note)
        .into('noteful_notes')
        .returning('*')
        .then((rows) => {
          return rows[0];
        });
    },
  
    updateNote(db, id, updateFields) {
      return db
        .select('*')
        .from('noteful_notes')
        .where('id', id)
        .update(updateFields);
    },
  
    deleteNote(db, id) {
      return db
        .select('*')
        .from('noteful_notes')
        .where('id', id)
        .delete();
    },
  };
  
  module.exports = NotesService;