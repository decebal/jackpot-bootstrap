import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { SpeakeasyClientController } from './speakeasy-client.controller';
import { SpeakeasyClientService } from './speakeasy-client.service';
import { SpeakeasyApiService } from './services/speakeasy-api.service';
import { ApiKeyAuthGuard } from './guards/api-key-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [SpeakeasyClientController],
  providers: [
    SpeakeasyClientService,
    SpeakeasyApiService,
    ApiKeyAuthGuard,
    {
      provide: 'APP_GUARD',
      useClass: ApiKeyAuthGuard,
    },
  ],
})
export class SpeakeasyClientModule {}
