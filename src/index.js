import uuid from 'uuid/v4';

function generateKeyFromProp(keyPropValue, overrideKeyProp) {
  if (!keyPropValue) {
    return uuid();
  }

  return overrideKeyProp ? uuid() : keyPropValue;
}

function generateResult(topicCfg, params) {
  const { keyProp, overrideKeyProp = false } = topicCfg;
  const { message } = params;

  if (!keyProp) {
    return { ...params, key: uuid() };
  }

  const keyPropValue = message[keyProp];
  const key = generateKeyFromProp(keyPropValue, overrideKeyProp);

  const newMessage = { ...message, ...{ [keyProp]: key } };

  return { ...params, ...{ message: newMessage }, key };
}

export default function keyGenerator(cfgs) {
  const cfgMap = cfgs.reduce((map, cfg) => {
    if (typeof cfg === 'string') {
      map.set(cfg, {});

      return map;
    }

    const { topic, ...restOfCfgs } = cfg;

    map.set(topic, restOfCfgs);

    return map;
  }, new Map());

  return (params, next) => {
    const { topic } = params;

    const topicCfg = cfgMap.get(topic);

    if (topicCfg == null) {
      return next({ ...params });
    }

    return next(generateResult(topicCfg, params));
  };
}
