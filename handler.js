const moment = require('moment-timezone');

module.exports.timeinjozi = async (event) => {
  let timezone = 'Africa/Johannesburg';

  if (event.queryStringParameters && event.queryStringParameters.timezone) {
    // eslint-disable-next-line prefer-destructuring
    timezone = event.queryStringParameters.timezone;

    if (!moment.timezone.names().includes(timezone)) {
      return {
        statusCode: '400',
        body: `Unknown timezone ${timezone}`
      };
    }
  }

  return {
    statusCode: '200',
    body: `The time in ${timezone} is: ${moment.timezone(timezone).format()}`
  };
};
