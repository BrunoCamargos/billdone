/* eslint no-param-reassign: 'off' */

import onFinished from 'on-finished';
import onHeaders from 'on-headers';

const bunyanMorgan = logger => {
  const getResponseTime = (req, res, digits = 2) => {
    // calculate diff
    const ms = ((res._startAt[0] - req._startAt[0]) * 1e3) +
      ((res._startAt[1] - req._startAt[1]) * 1e-6);

    // return truncated value
    return ms.toFixed(digits);
  };

  function recordStartTime() {
    this._startAt = process.hrtime();
  }

  const expressMiddleware = (req, res, next) => {
    if (!logger) {
      logger = req.logger;

      if (!logger) {
        throw Error('parameter logger not provided');
      }
    }
    // request and response start time
    req._startAt = undefined;
    res._startAt = undefined;

    recordStartTime.call(req);

    const logRequest = () => logger.info({ req }, 'Request');

    const logResponse = () => {
      res.responseTime = getResponseTime(req, res);
      logger.info({ res }, 'Response');
    };

    logRequest();

    // record response start
    onHeaders(res, recordStartTime);

    // log response when finished
    onFinished(res, logResponse);

    next();
  };

  return expressMiddleware;
};

export default bunyanMorgan;
