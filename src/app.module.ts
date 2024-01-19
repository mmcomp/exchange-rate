import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ExchangesModule } from './exchanges/exchanges.module';
import { RatesModule } from './rates/rates.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (
        conf: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        return {
          type: 'postgres',
          host: await conf.get('POSTGRES_HOST'),
          port: +(await conf.get('POSTGRES_PORT')),
          username: await conf.get('POSTGRES_USER'),
          password: await conf.get('POSTGRES_PASSWORD'),
          database: await conf.get('POSTGRES_DATABASE'),
          entities: ['**/*.entity.js'],
          synchronize: true,
        };
      },
    }),
    ExchangesModule,
    RatesModule,
  ],
})
export class AppModule {}
