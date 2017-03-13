import config from './config';

const paginate = (page, pageLimit) => {
  let skip = parseInt(page, 10);
  if (isNaN(skip) || skip < 1) {
    skip = 1;
  }
  skip -= 1;

  let limit = parseInt(pageLimit, 10);
  if (isNaN(limit) || limit < 1 || limit > config.app.defaultPageLimit) {
    limit = config.app.defaultPageLimit;
  }

  return { skip: (skip *= limit), limit };
};

export default paginate;
