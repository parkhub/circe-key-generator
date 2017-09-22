import uuid from 'uuid/v4';

export default function simpleFlow(publishCfgs, next) {
  const { key: masterKey } = publishCfgs;

  return next({ ...publishCfgs, key: masterKey || uuid() });
}
