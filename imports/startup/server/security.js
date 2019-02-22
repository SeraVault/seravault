import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

const numberOfAttempts = 5;
const timeInterval = 60;

DDPRateLimiter.addRule(
  {
    type: 'method',
    userId: null,
    clientAddress: null,
    name(name) {
      const methods = [
        'twoFactor.verifyCodeAndLogin',
        'twoFactor.getAuthenticationCode'
      ];
      return methods.includes(name);
    },
    connectionId() {
      return true;
    }
  },
  numberOfAttempts,
  timeInterval * 1000
);