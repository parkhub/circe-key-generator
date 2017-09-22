import simpleFlow from './simpleFlow';

export default function complexFlow(publishCfgs, complexCfgs, next) {
  const { message, key: masterKey } = publishCfgs;
  const { keyProp } = complexCfgs;

  if (typeof message === 'string' || keyProp == null) {
    return simpleFlow(publishCfgs, next);
  }

  return next({ ...publishCfgs, message: { ...message, [keyProp]: masterKey } });
}
