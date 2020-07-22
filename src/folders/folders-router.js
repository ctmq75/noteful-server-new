const path = require('path');
const express = require('express');
const FoldersService = require('./folders-service');
const foldersRouter = express.Router();
const jsonParser = express.json();

foldersRouter
  .route('/')
  .get((req, res, next) => {
    FoldersService.getAllFolders(req.app.get('db'))
      .then((folders) => {
        return res.json(folders);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { folder_name } = req.body;
    const newFolder = { folder_name };

    for (const [key, value] of Object.entries(newFolder)) {
      if (!value) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    FoldersService.createFolder(req.app.get('db'), newFolder)
      .then((folder) => {
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${folder.id}`))
          .json(folder);
      })
      .catch(next);
  });

foldersRouter.route('/:folder_id').all((req, res, next) => {
  FoldersService.getFolder(req.app.get('db'), req.param.folder_id)
    .then((folder) => {
      if (!folder) {
        return res.status(404).json({
          error: { message: 'Folder does not exist' },
        });
      }
      res.folder = folder;
      next();
    })
    .get((req, res) => {
      return res.json(res.folder);
    })
    .delete((req, res, next) => {
      FoldersService.deleteFolder(req.app.get('db'), req.params.folder_id)
        .then(() => {
          return res.status(204).end();
        })
        .catch(next);
    });
});

module.exports = foldersRouter;