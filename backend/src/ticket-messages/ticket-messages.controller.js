import * as service from './ticket-messages.service.js';

export async function list(req, res, next) {
  try {
    res.json(await service.list(req.params.id));
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    res.status(201).json(await service.create(req.params.id, req.user.sub, req.body));
  } catch (err) {
    next(err);
  }
}
