import { Module } from '@nestjs/common';
import { ExchangesController } from './exchanges.controller';
import { ExchangesService } from './exchanges.service';
import { ExchangeRate } from './entities/exchange-rate.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './entities/asset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExchangeRate, Asset])],
  controllers: [ExchangesController],
  providers: [ExchangesService],
  exports: [ExchangesService],
})
export class ExchangesModule {}
