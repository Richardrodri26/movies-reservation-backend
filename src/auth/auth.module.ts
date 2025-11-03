import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config/envs';
import { JwtStrategy } from './jwt.strategy';
import { BcryptAdapter, HASH_ADAPTER } from 'src/adapters';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: envs.jwtSecret,
      signOptions: { expiresIn: '1d' },
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: HASH_ADAPTER,
      useClass: BcryptAdapter,
    },
  ],
  exports: [AuthService, { provide: HASH_ADAPTER, useClass: BcryptAdapter }]
})
export class AuthModule {}
