/* eslint no-param-reassign: 'off' */

import onFinished from 'on-finished';
import onHeaders from 'on-headers';

const bunyanMorgan = (logger) => {
  const getResponseTime = (req, res, digits = 2) => {
    // calculate diff
    const ms = ((res._startAt[0] - req._startAt[0]) * 1e3) +
      ((res._startAt[1] - req._startAt[1]) * 1e-6);

    // return truncated value
    return ms.toFixed(digits);
  };

  function recordStartTime() {
    this._startAt = process.hrtime();
    this._startTime = Date.now();
  }

  const expressMiddleware = (req, res, next) => {
    // request data
    req._startAt = undefined;
    req._startTime = undefined;

    // response data
    res._startAt = undefined;
    res._startTime = undefined;

    recordStartTime.call(req);

    const logRequest = () => {
      logger.info('req._startAt: ', req._startAt);
      logger.info('req._startTime: ', req._startTime);
    };

    const logResponse = () => {
      logger.info(`${getResponseTime(req, res)}ms`);
    };

    // log request
    logRequest();

    // record response start
    onHeaders(res, recordStartTime);

    // log when response finished
    onFinished(res, logResponse);

    next();
  };

  return expressMiddleware;
};

export default bunyanMorgan;
