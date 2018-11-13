import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { use } from 'passport';
import { USER_MODEL_TOKEN } from '../../../server.constants';
import { IUser } from '../../user/interfaces/user.interface';

const { Issuer, Strategy } = require('openid-client');

@Injectable()
export class OIDCStrategy {
  private issuer: any;
  private client: any;

  constructor(@Inject(USER_MODEL_TOKEN) private readonly userModel: Model<IUser>) {
    this.init();
  }

  private init(): void {
    this.issuer = new Issuer({
      issuer: 'https://demo-ti.fluance.net:8081',
      authorization_endpoint: 'https://demo-ti.fluance.net:8081/auth/oauth/authorize',
      // jwks_uri: 'https://op.example.com/jwks',
      token_endpoint: 'https://demo-ti.fluance.net:8081/auth/oauth/token',
      userinfo_endpoint: 'https://demo-ti.fluance.net:8081/auth/oauth2/validate'
      // code_challenge_methods_supported: ['plain', 'S256'],
    });

    this.client = new this.issuer.Client({
      client_id: 'komed-health',
      client_secret: 'VQT2xhVSDhHhY3SJB',
      respose_types: ['code'],
      redirect_uris: ['http://localhost:4200/api/auth/oidc/cb']
    });

    use(
      'oidc',
      new Strategy({ client: this.client }, async (tokenset: any, userinfo: any, done: Function) => {
        try {
          console.log('XXX made it!!!');
          console.log(userinfo);
          console.log('tokenset', tokenset);
          console.log('access_token', tokenset.access_token);
          console.log('id_token', tokenset.id_token);
          console.log('claims', tokenset.claims);
          console.log('userinfo', userinfo);
          // const existingUser: IUser = await this.userModel.findOne({ 'twitter.id': profile.id });

          // if (existingUser) {
          //   return done(null, existingUser);
          // }

          // const { id, username, displayName } = profile;
          // const user: IUser = new this.userModel({
          //   method: 'twitter',
          //   roles: ['user'],
          //   twitter: {
          //     id,
          //     username,
          //     displayName
          //   }
          // });

          // done(null, await user.save());
        } catch (err) {
          done(err, null);
        }
      })
    );
  }
}
