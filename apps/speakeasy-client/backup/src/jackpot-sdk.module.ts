import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JackpotSDKController } from './jackpot-sdk.controller'
import { JackpotSDKService } from './jackpot-sdk.service'

/**
 * Module for the Jackpot SDK client
 * 
 * This module provides services for interacting with the Jackpot Gateway API
 * using the Speakeasy-generated SDK
 */
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
	],
	controllers: [JackpotSDKController],
	providers: [JackpotSDKService],
	exports: [JackpotSDKService],
})
export class JackpotSDKModule {}
