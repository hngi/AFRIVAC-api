/**
 * @file This is the main application configuration file. It reads environment variables using the
 * DotEnv Package @see {@link https://www.npmjs.com/package/dotenv} and exports the configuration as a module.
* @author Gabriel <Gabrielsonchia@gmail.com> <20/06/2020 06:37am>
 * @since 0.1.0
 * Last Modified: Gabriel <Gabrielsonchia@gmail.com> <13/07/2020 06:17pm>
 */

const dotenv = require('dotenv');
const bunyan = require('bunyan');

const APP_NAME = 'afivac';

// load env configuration as early as possible
dotenv.config();

const {
  PORT = 3000,
  MONGODB_PROD_URI,
  MONGODB_LOCAL_URI,
  NODE_ENV = 'production',
} = process.env;

// export configuration
module.exports = {
  applicationName: APP_NAME,
  port: PORT,
  logger: bunyan.createLogger({ name: APP_NAME }),
  mongodb: {
    dsn: NODE_ENV === 'production' ? MONGODB_PROD_URI : MONGODB_LOCAL_URI,
    dsn: NODE_ENV === 'development' ? MONGODB_PROD_URI : MONGODB_LOCAL_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
    },
  },
  production: NODE_ENV === 'production',
};
