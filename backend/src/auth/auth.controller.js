import * as service from './auth.service.js';

export async function register(req, res, next) {
  try {
    res.status(201).json(await service.register(req.body));
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    res.json(await service.login(req.body));
  } catch (err) {
    next(err);
  }
}

export async function refresh(req, res, next) {
  try {
    res.json(await service.refresh(req.body));
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    res.json(await service.logout(req.body));
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    res.json(await service.me(req.user));
  } catch (err) {
    next(err);
  }
}
