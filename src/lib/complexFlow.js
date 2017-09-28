import simpleFlow from './simpleFlow';

function doesKeyPropExists(keyPropValue) {
  return keyPropValue != null;
}

export default function complexFlow(publishCfgs, complexCfgs, next) {
  const { message, key: masterKey } = publishCfgs;
  const { keyProp } = complexCfgs;

  if (typeof message === 'string' || keyProp == null) {
    return simpleFlow(publishCfgs, next);
  }

  const keyPropValue = message[keyProp];

  if (doesKeyPropExists(keyPropValue) && masterKey == null) {
    return next({ ...publishCfgs, key: keyPropValue });
  }

  return next({ ...publishCfgs, message: { ...message, [keyProp]: masterKey } });
}
