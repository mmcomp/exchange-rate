import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ExchangesService } from '../exchanges/exchanges.service';
import { RateProviderEnum } from '../exchanges/enums/rate-provider.enum';
import { RateProviderAService } from './providers/rate-provider-a.service';
import { RateProviderBService } from './providers/rate-provider-b.service';
import { RateProviderCService } from './providers/rate-provider-c.service';
import { RateProviderService } from './providers/rate-provider.interface';

@Injectable()
export class RatesService {
  constructor(
    private readonly exchangesService: ExchangesService,
    private readonly a: RateProviderAService,
    private readonly b: RateProviderBService,
    private readonly c: RateProviderCService,
  ) {}

  async selectProviderForExchangeRate(
    from: string,
    to: string,
  ): Promise<RateProviderEnum> {
    const fromAsset = await this.exchangesService.findAssetByNameOrFail(from);
    const toAsset = await this.exchangesService.findAssetByNameOrFail(to);
    if (fromAsset.type !== toAsset.type) {
      throw new BadRequestException('This exchange is not possible');
    }
    const { provider } = await this.exchangesService.findRateProvider(
      fromAsset.id,
      toAsset.id,
    );
    return provider;
  }

  selectRateProviderService(provider: RateProviderEnum): RateProviderService {
    switch (provider) {
      case RateProviderEnum.A:
        return this.a;
      case RateProviderEnum.B:
        return this.b;
      case RateProviderEnum.C:
        return this.c;

      default:
        throw new InternalServerErrorException(
          `Unhandled provider [${provider}]`,
        );
        break;
    }
  }

  async calculateExchangeRate(
    from: string,
    to: string,
  ): Promise<{ rate: number }> {
    const rateProviderService = this.selectRateProviderService(
      await this.selectProviderForExchangeRate(from, to),
    );

    const rate = await rateProviderService.getRate(from, to);

    return { rate };
  }
}
