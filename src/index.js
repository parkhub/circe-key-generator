import simpleFlow from './lib/simpleFlow';
import complexFlow from './lib/complexFlow';

// function generateKeyFromProp(keyPropValue, overrideKeyProp) {
//   if (!keyPropValue) {
//     return uuid();
//   }
//
//   return overrideKeyProp ? uuid() : keyPropValue;
// }
//
// function generateMessageAndKey(topicCfg: TopicCfg, currentMessage: Message) {
//   const { keyProp, overrideKeyProp = false } = topicCfg;
//
//   if (!keyProp) {
//     return { key: uuid() };
//   }
//
//   const keyPropValue = currentMessage[keyProp];
//   const key = generateKeyFromProp(keyPropValue, overrideKeyProp);
//
//   const newMessage = Object.assign({}, currentMessage, { [keyProp]: key });
//
//   return { message: newMessage, key };
// }

export default function keyGenerator(cfgs) {
  const cfgMap = cfgs.reduce((map, cfg) => {
    if (typeof cfg === 'string') {
      map.set(cfg, { flowType: 'simple' });

      return map;
    }

    const { topic, ...complexCfgs } = cfg;

    map.set(topic, { flowType: 'complex', complexCfgs });

    return map;
  }, new Map());

  return (publishCfgs, next) => {
    const { topic } = publishCfgs;

    const topicCfg = cfgMap.get(topic);

    if (topicCfg == null) {
      return next({ ...publishCfgs });
    }

    const { flowType, complexCfgs } = topicCfg;

    if (flowType === 'simple') {
      return simpleFlow(publishCfgs, next);
    }

    return complexFlow(publishCfgs, complexCfgs, next);
  };
}
