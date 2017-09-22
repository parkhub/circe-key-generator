import keyGenerator from './';
import simpleFlow from './lib/simpleFlow';
import complexFlow from './lib/complexFlow';

jest.mock('./lib/simpleFlow');
jest.mock('./lib/complexFlow');

beforeEach(() => jest.clearAllMocks());

test('Should handle a flowtype complex configuration', () => {
  const topic = 'TEST_TOPIC';
  const complexCfg = {
    topic,
    complexCfgProp: 'IM COMPLEX'
  };
  const cfgs = [complexCfg];

  const next = jest.fn();

  const generator = keyGenerator(cfgs);

  const publishCfgs = {
    topic
  };

  generator(publishCfgs, next);

  expect(complexFlow).toHaveBeenCalledTimes(1);
  expect(complexFlow).toHaveBeenCalledWith(publishCfgs, { complexCfgProp: 'IM COMPLEX' }, next);
});

test('Should handle a flowType simple configuration', () => {
  const topic = 'TEST_TOPIC';
  const cfgs = [topic];

  const next = jest.fn();

  const generator = keyGenerator(cfgs);

  const publishCfgs = {
    topic
  };

  generator(publishCfgs, next);

  expect(simpleFlow).toHaveBeenCalledTimes(1);
  expect(simpleFlow).toHaveBeenCalledWith(publishCfgs, next);
});

test('Should do nothing for a message from a topic that is not configured', () => {
  const cfgs = ['TEST_TOPIC', { topic: 'COMPLEX_FLOW' }];

  const next = jest.fn();

  const generator = keyGenerator(cfgs);

  const publishCfgs = {
    topic: 'ANOTHER_TEST_TOPIC'
  };

  generator(publishCfgs, next);

  expect(simpleFlow).toHaveBeenCalledTimes(0);
  expect(next).toHaveBeenCalledWith({ ...publishCfgs });
});

// test('Should generate a key only for the configured topic', () => {
//   const cfgs = ['TEST_TOPIC'];
//
//   const next = jest.fn();
//
//   const generator = keyGenerator(cfgs);
//
//   const generatorParams = {
//     topic: 'ANOTHER_TEST_TOPIC'
//   };
//
//   generator(generatorParams, next);
//
//   expect(uuid).toHaveBeenCalledTimes(0);
//   expect(next).toHaveBeenCalledWith({ ...generatorParams });
// });
//
// test('Should generate a key and attach it to the message object on configured property and params', () => {
//   const cfgs = [{ topic: 'TEST_TOPIC', keyProp: 'pikaKey' }];
//
//   const next = jest.fn();
//
//   const generator = keyGenerator(cfgs);
//
//   const message = {
//     test: 'pikachu'
//   };
//   const generatorParams = {
//     message,
//     topic: 'TEST_TOPIC'
//   };
//
//   generator(generatorParams, next);
//
//   expect(uuid).toHaveBeenCalledTimes(1);
//   const expectedMessage = { message: { ...message, pikaKey: 'MOCK_KEY' } };
//
//   expect(next).toHaveBeenCalledWith({ ...generatorParams, ...expectedMessage, key: 'MOCK_KEY' });
// });
//
// test('Should use a property value from the message as a key for kafka, if it exists', () => {
//   const cfgs = [{ topic: 'TEST_TOPIC', keyProp: 'pikaKey' }];
//
//   const next = jest.fn();
//
//   const generator = keyGenerator(cfgs);
//
//   const message = {
//     test: 'pikachu',
//     pikaKey: 'ALREADY_HERE'
//   };
//   const generatorParams = {
//     message,
//     topic: 'TEST_TOPIC'
//   };
//
//   generator(generatorParams, next);
//
//   expect(uuid).toHaveBeenCalledTimes(0);
//
//   expect(next).toHaveBeenCalledWith({ ...generatorParams, key: 'ALREADY_HERE' });
// });
//
// test('Should use override a keyProp even if it exists', () => {
//   const cfgs = [{ topic: 'TEST_TOPIC', keyProp: 'pikaKey', overrideKeyProp: true }];
//
//   const next = jest.fn();
//
//   const generator = keyGenerator(cfgs);
//
//   const message = {
//     test: 'pikachu',
//     pikaKey: 'ALREADY_HERE'
//   };
//   const generatorParams = {
//     message,
//     topic: 'TEST_TOPIC'
//   };
//
//   generator(generatorParams, next);
//
//   expect(uuid).toHaveBeenCalledTimes(1);
//
//   const expectedMessage = { message: { ...message, pikaKey: 'MOCK_KEY' } };
//   expect(next).toHaveBeenCalledWith({ ...generatorParams, ...expectedMessage, key: 'MOCK_KEY' });
// });
//
// test('Should use a key passed along with the publish configuration and override keyProp', () => {
//   const cfgs = [{ topic: 'TEST_TOPIC', keyProp: 'pikaKey', overrideKeyProp: true }];
//
//   const next = jest.fn();
//
//   const generator = keyGenerator(cfgs);
//
//   const message = {
//     test: 'pikachu',
//     pikaKey: 'ALREADY_HERE'
//   };
//
//   const generatorParams = {
//     message,
//     key: 'MASTER_KEY',
//     topic: 'TEST_TOPIC'
//   };
//
//   generator(generatorParams, next);
//
//   expect(uuid).toHaveBeenCalledTimes(1);
//
//   const expectedMessage = { message: { ...message, pikaKey: 'MASTER_KEY' } };
//   expect(next).toHaveBeenCalledWith({
//     ...generatorParams,
//     ...expectedMessage,
//     key: 'MASTER_KEY'
//   });
// });
