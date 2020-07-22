
const path = require('path');
const express = require('express');
const NotesService = require('./notes-service');
const notesRouter = express.Router();
const jsonParser = express.json();

notesRouter
  .route('/')
  .get((req, res, next) => {
    NotesService.getAllNotes(req.app.get('db'))
      .then((notes) => {
        return res.json(notes);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { note_name, content, folder_id } = req.body;
    const newnote = { note_name, content, folder_id };

    for (const [key, value] of Object.entries(newnote)) {
      if (!value) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    NotesService.createNote(req.app.get('db'), newnote)
      .then((note) => {
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${note.id}`))
          .json(note);
      })
      .catch(next);
  });

notesRouter
  .route('/:note_id')
  .all((req, res, next) => {
    NotesService.getNote(req.app.get('db'), req.params.note_id).then((note) => {
      if (!note) {
        return res.status(404).json({
          error: { message: 'Note does not exist' },
        });
      }
      res.note = note;
      next();
    });
  })
  .get((req, res) => {
    return res.json(res.note);
  })
  .delete((req, res, next) => {
    NotesService.deleteNote(req.app.get('db'), req.params.note_id)
      .then(() => {
        return res.status(204).end();
      })
      .catch(next);
  });

module.exports = notesRouter;