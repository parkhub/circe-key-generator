import uuid from 'uuid/v4';
import simpleFlow from './simpleFlow';

jest.mock('uuid/v4');

beforeEach(() => jest.clearAllMocks());

describe('Message is a string', () => {
  test('Should use the key publish configuration if it exists', () => {
    const next = jest.fn();

    const message = 'THIS IS A STRING';
    const publishCfgs = {
      message,
      key: 'MASTER_KEY',
      topic: 'TEST_TOPIC'
    };

    simpleFlow(publishCfgs, next);

    expect(uuid).toHaveBeenCalledTimes(0);
    expect(next).toHaveBeenCalledWith({ ...publishCfgs, key: 'MASTER_KEY' });
  });

  test('Should generate and pass that key to be used by kafka', () => {
    const next = jest.fn();

    const message = 'THIS IS A STRING';
    const publishCfgs = {
      message,
      topic: 'TEST_TOPIC'
    };

    simpleFlow(publishCfgs, next);

    expect(uuid).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith({ ...publishCfgs, key: 'MOCK_KEY' });
  });
});

describe('Message is an object', () => {
  test('Should use the key publish configuration if it exists', () => {
    const next = jest.fn();

    const message = {
      test: 'TEST'
    };
    const publishCfgs = {
      message,
      key: 'MASTER_KEY',
      topic: 'TEST_TOPIC'
    };

    simpleFlow(publishCfgs, next);

    expect(uuid).toHaveBeenCalledTimes(0);
    expect(next).toHaveBeenCalledWith({ ...publishCfgs, key: 'MASTER_KEY' });
  });

  test('Should generate and pass that key to be used by kafka', () => {
    const next = jest.fn();

    const message = {
      test: 'TEST'
    };
    const publishCfgs = {
      message,
      topic: 'TEST_TOPIC'
    };

    simpleFlow(publishCfgs, next);

    expect(uuid).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith({ ...publishCfgs, key: 'MOCK_KEY' });
  });
});
