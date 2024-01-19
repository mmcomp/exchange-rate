import { Module } from '@nestjs/common';
import { RatesService } from './rates.service';
import { RatesController } from './rates.controller';
import { ExchangesModule } from '../exchanges/exchanges.module';
import { RateProviderAService } from './providers/rate-provider-a.service';
import { RateProviderBService } from './providers/rate-provider-b.service';
import { RateProviderCService } from './providers/rate-provider-c.service';

@Module({
  imports: [ExchangesModule],
  providers: [
    RatesService,
    RateProviderAService,
    RateProviderBService,
    RateProviderCService,
  ],
  controllers: [RatesController],
})
export class RatesModule {}
