import { enableProdMode } from '@angular/core';
import { NestFactory } from '@nestjs/core';
import * as e from 'express';
import * as passport from 'passport';
import { ApplicationModule } from './app.module';
import './polyfills';
import { SERVER_CONFIG } from './server.constants';
const session = require('express-session');

declare const module: any;

async function bootstrap() {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

  const express: any = e();

  if (process.env.NODE_ENV === 'production') {
    enableProdMode();
  }

  require('./config/index')(SERVER_CONFIG, express);

  const app = await NestFactory.create(ApplicationModule, express);

  app.enableCors();

  // Authentication configuration
  app.use(
    session({
      resave: false,
      saveUninitialized: true,
      secret: 'bla'
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(SERVER_CONFIG.httpPort);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
