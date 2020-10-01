jest.mock('moment-timezone');

const { timezone } = require('moment-timezone');
const handler = require('./handler');

const EXPECTED_DATE = '2020-09-01 00:00:00';
const TIMEZONE = 'Africa/Windhoek';
const DEFAULT_TIMEZONE = 'Africa/Johannesburg';

describe('When call handler.timeinjozi', () => {
  it('Should return the expected date if the provided timezone exists', async () => {
    const event = {
      queryStringParameters: {
        timezone: TIMEZONE
      }
    };

    timezone.names = () => { return [TIMEZONE]; };

    timezone.mockImplementation(() => {
      return {
        format: () => { return EXPECTED_DATE; }
      };
    });

    const response = await handler.timeinjozi(event);

    expect(response.statusCode).toMatch(/200/);
    expect(response.body).toMatch(`The time in ${TIMEZONE} is: ${EXPECTED_DATE}`);
  });

  it('Should return the date for the default timezone if none has been specified', async () => {
    timezone.names = () => { return [TIMEZONE]; };

    timezone.mockImplementation(() => {
      return {
        format: () => { return EXPECTED_DATE; }
      };
    });

    const response = await handler.timeinjozi({ queryStringParameters: {} });

    expect(response.statusCode).toMatch(/200/);
    expect(response.body).toMatch(`The time in ${DEFAULT_TIMEZONE} is: ${EXPECTED_DATE}`);
  });

  it('Should return an error if the provided timezone does not exists', async () => {
    const event = {
      queryStringParameters: {
        timezone: TIMEZONE
      }
    };
    timezone.names = () => { return []; };

    const response = await handler.timeinjozi(event);

    expect(response.statusCode).toMatch(/400/);
    expect(response.body).toMatch(`Unknown timezone ${TIMEZONE}`);
  });
});
