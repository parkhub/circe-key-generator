import uuid from 'uuid/v4';
import keyGenerator from './';

jest.mock('uuid/v4');

beforeEach(() => jest.clearAllMocks());

test('Should generate and pass that key to be used by kafka', () => {
  const cfgs = ['TEST_TOPIC'];

  const next = jest.fn();

  const generator = keyGenerator(cfgs);

  const generatorParams = {
    topic: 'TEST_TOPIC'
  };

  generator(generatorParams, next);

  expect(uuid).toHaveBeenCalledTimes(1);
  expect(next).toHaveBeenCalledWith({ ...generatorParams, key: 'MOCK_KEY' });
});

test('Should generate a key only for the configured topic', () => {
  const cfgs = ['TEST_TOPIC'];

  const next = jest.fn();

  const generator = keyGenerator(cfgs);

  const generatorParams = {
    topic: 'ANOTHER_TEST_TOPIC'
  };

  generator(generatorParams, next);

  expect(uuid).toHaveBeenCalledTimes(0);
  expect(next).toHaveBeenCalledWith({ ...generatorParams });
});

test('Should generate a key and attach it to the message object on configured property and params', () => {
  const cfgs = [{ topic: 'TEST_TOPIC', keyProp: 'pikaKey' }];

  const next = jest.fn();

  const generator = keyGenerator(cfgs);

  const message = {
    test: 'pikachu'
  };
  const generatorParams = {
    message,
    topic: 'TEST_TOPIC'
  };

  generator(generatorParams, next);

  expect(uuid).toHaveBeenCalledTimes(1);
  const expectedMessage = { message: { ...message, pikaKey: 'MOCK_KEY' } };

  expect(next).toHaveBeenCalledWith({ ...generatorParams, ...expectedMessage, key: 'MOCK_KEY' });
});

test('Should use a property value from the message as a key for kafka, if it exists', () => {
  const cfgs = [{ topic: 'TEST_TOPIC', keyProp: 'pikaKey' }];

  const next = jest.fn();

  const generator = keyGenerator(cfgs);

  const message = {
    test: 'pikachu',
    pikaKey: 'ALREADY_HERE'
  };
  const generatorParams = {
    message,
    topic: 'TEST_TOPIC'
  };

  generator(generatorParams, next);

  expect(uuid).toHaveBeenCalledTimes(0);

  expect(next).toHaveBeenCalledWith({ ...generatorParams, key: 'ALREADY_HERE' });
});

test('Should use override a keyProp even if it exists', () => {
  const cfgs = [{ topic: 'TEST_TOPIC', keyProp: 'pikaKey', overrideKeyProp: true }];

  const next = jest.fn();

  const generator = keyGenerator(cfgs);

  const message = {
    test: 'pikachu',
    pikaKey: 'ALREADY_HERE'
  };
  const generatorParams = {
    message,
    topic: 'TEST_TOPIC'
  };

  generator(generatorParams, next);

  expect(uuid).toHaveBeenCalledTimes(1);

  const expectedMessage = { message: { ...message, pikaKey: 'MOCK_KEY' } };
  expect(next).toHaveBeenCalledWith({ ...generatorParams, ...expectedMessage, key: 'MOCK_KEY' });
});
