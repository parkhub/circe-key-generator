import complexFlow from './complexFlow';
import simpleFlow from './simpleFlow';

jest.mock('./simpleFlow');

beforeEach(() => jest.clearAllMocks());

describe('Message is a string', () => {
  test('Should implement simple flow', () => {
    const next = jest.fn();
    const topic = 'COMPLEX_TOPIC';
    const complexCfgs = {
      keyProp: 'whatAmI'
    };

    const publishCfgs = {
      topic,
      message: 'IM A GIRAFFE!'
    };

    complexFlow(publishCfgs, complexCfgs, next);

    expect(simpleFlow).toHaveBeenCalledWith(publishCfgs, next);
  });
});

describe('Message is an object', () => {
  test('Should implement simple flow if keyProp is not configured', () => {
    const next = jest.fn();
    const topic = 'COMPLEX_TOPIC';

    const complexCfgs = {
      overrideKeyProp: true
    };

    const message = {
      whatAmI: 'IM A GIRAFFE'
    };

    const publishCfgs = {
      topic,
      message
    };

    complexFlow(publishCfgs, complexCfgs, next);

    expect(simpleFlow).toHaveBeenCalledWith(publishCfgs, next);
  });

  describe('keyProp is configured', () => {
    test('Should use publish cfg key value as kafka key and override key prop', () => {
      const next = jest.fn();
      const topic = 'COMPLEX_TOPIC';
      const key = 'MASTER_KEY';

      const complexCfgs = {
        keyProp: 'whatAmI'
      };

      const message = {
        whatAmI: 'IM A GIRAFFE',
        bestEver: 'Leo'
      };

      const publishCfgs = {
        topic,
        key,
        message
      };

      complexFlow(publishCfgs, complexCfgs, next);

      const expectedMessage = {
        whatAmI: key,
        bestEver: 'Leo'
      };

      expect(next).toHaveBeenCalledWith({ ...publishCfgs, message: expectedMessage, key });
    });

    test('Should use the value in keyProp if no key is passed and value exists', () => {
      const next = jest.fn();
      const topic = 'COMPLEX_TOPIC';
      const key = 'IM A GIRAFFE';

      const complexCfgs = {
        keyProp: 'whatAmI'
      };

      const message = {
        whatAmI: key,
        bestEver: 'Leo'
      };

      const publishCfgs = {
        topic,
        message
      };

      complexFlow(publishCfgs, complexCfgs, next);

      const expectedMessage = {
        whatAmI: key,
        bestEver: 'Leo'
      };

      expect(next).toHaveBeenCalledWith({ ...publishCfgs, message: expectedMessage, key });
    });
  });
});
