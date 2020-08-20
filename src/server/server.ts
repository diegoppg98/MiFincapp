import * as Express from 'express';
import { applyMiddlewares } from './middlewares';
import { StaticRoutes } from './routes/StaticRoutes';
import { SSRRoutes } from './routes/SSRRoutes';

import { DemoRoutes } from './routes/DemoRoutes';
import { CounterRoutes } from './routes/CounterRoutes';

export const app: Express.Application = Express();

app.disable('x-powered-by');

applyMiddlewares(app);

DemoRoutes(app);
CounterRoutes(app);

/**
 * core routes, don't delete these
 */
StaticRoutes(app);
SSRRoutes(app);
