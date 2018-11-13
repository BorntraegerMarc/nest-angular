import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { authenticate } from 'passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { authProviders } from './auth.providers';
import { AuthService } from './auth.service';
import { bodyValidatorMiddleware } from './middlewares/body-validator.middleware';
import { FacebookStrategy } from './passport/facebook.strategy';
import { GoogleStrategy } from './passport/google-plus.strategy';
import { JwtStrategy } from './passport/jwt.strategy';
// Strategies
import { LocalStrategy } from './passport/local.strategy';
import { OIDCStrategy } from './passport/oidc.strategy';
import { TwitterStrategy } from './passport/twitter.strategy';

@Module({
  imports: [UserModule],
  providers: [
    ...authProviders,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    FacebookStrategy,
    TwitterStrategy,
    GoogleStrategy,
    OIDCStrategy
  ],
  controllers: [AuthController]
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        bodyValidatorMiddleware,
        authenticate('local-signup', { session: false })
      )
      .forRoutes('api/auth/local/signup');

    consumer
      .apply(
        bodyValidatorMiddleware,
        authenticate('local-signin', { session: false })
      )
      .forRoutes('api/auth/local/signin');

    consumer
      .apply(authenticate('facebook', { session: false }))
      .forRoutes('api/auth/facebook/token');

    consumer
      .apply(authenticate('twitter', { session: false }))
      .forRoutes('api/auth/twitter/token');

    consumer
      .apply(authenticate('google', { session: false }))
      .forRoutes('api/auth/google/token');

    consumer
      .apply(authenticate('oidc', { session: true }))
      .forRoutes('api/auth/oidc/signin');
    consumer
      .apply(authenticate('oidc', { session: true }))
      .forRoutes('api/auth/oidc/cb');
  }
}
