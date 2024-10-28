import express from 'npm:express@5.0.1';
import helmet from 'npm:helmet@8.0.0';
import cors from 'npm:cors@2.8.5';

import { APP_CONFIG } from './src/config/app_config.ts';
import * as utils from './src/util/object.ts';
import * as repositoryUtil from './src/util/repository.ts';
import { controllers } from './src/controller/mod.ts';
import { logRequests } from './src/middleware/log_middleware.ts';
import LOG from './src/log/default_logger.ts';
import { errorHandler } from './src/middleware/error_middleware.ts';
import { initializeORM } from './src/config/orm_config.ts';
import { RATE_LIMIT_CONFIG } from './src/config/rate_limit_config.ts';

if (!utils.checkDefinedValues(APP_CONFIG)) {
	LOG.error('Some values in APP_CONFIG are not defined, exiting the process ...');
	Deno.exit(1);
}

const ORM_CONFIG = await initializeORM();
repositoryUtil.initializeRepositories(ORM_CONFIG);

const app = express();
app.set('trust proxy', 1);
app.use(RATE_LIMIT_CONFIG);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
//TODO rate limiter

app.use(logRequests);

app.use('/api', controllers);

app.use(errorHandler);

const PORT = Deno.env.get('APP_PORT') || 3000;
const HOST = Deno.env.get('HOST') || '0.0.0.0';

app.listen(Number(PORT), HOST, () => {
	LOG.info(`HTTP server is running at http://${HOST}:${PORT}`);
});
