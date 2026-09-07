import * as service from './reports.service.js';

export async function list(req, res, next) {
  try {
    res.json(await service.list(req.query));
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    res.json(await service.getById(req.params.id));
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    res.status(201).json(await service.create(req.body));
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    res.json(await service.update(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await service.remove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
