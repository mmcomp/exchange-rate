import { Test, TestingModule } from '@nestjs/testing';
import { RatesService } from './rates.service';
import { ExchangesService } from '../exchanges/exchanges.service';
import { RateProviderAService } from './providers/rate-provider-a.service';
import { RateProviderBService } from './providers/rate-provider-b.service';
import { RateProviderCService } from './providers/rate-provider-c.service';
import { RateProviderEnum } from '../exchanges/enums/rate-provider.enum';
import { ExchangeRate } from '../exchanges/entities/exchange-rate.entity';
import { Asset } from '../exchanges/entities/asset.entity';
import { AssetType } from '../exchanges/enums/asset-type.enum';
import { BadRequestException } from '@nestjs/common';

describe('RatesService', () => {
  let service: RatesService;
  let exchangesService: ExchangesService;
  let rateProviderAService: RateProviderAService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ExchangesService,
          useFactory: () => ({
            findAssetByNameOrFail: jest.fn(),
            findRateProvider: jest.fn(),
          }),
        },
        {
          provide: RateProviderAService,
          useFactory: () => ({
            getRate: jest.fn(),
          }),
        },
        {
          provide: RateProviderBService,
          useFactory: () => ({
            getRate: jest.fn(),
          }),
        },
        {
          provide: RateProviderCService,
          useFactory: () => ({
            getRate: jest.fn(),
          }),
        },
        RatesService,
      ],
    }).compile();

    service = module.get<RatesService>(RatesService);
    exchangesService = module.get<ExchangesService>(ExchangesService);
    rateProviderAService =
      module.get<RateProviderAService>(RateProviderAService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('selectProviderForExchangeRate', () => {
    it('should return a provider', async () => {
      const from = 'IRR';
      const to = 'USD';
      const id = 'id';
      jest.spyOn(exchangesService, 'findAssetByNameOrFail').mockResolvedValue({
        type: AssetType.FIAT,
        id,
      } as Asset);
      jest.spyOn(exchangesService, 'findRateProvider').mockResolvedValue({
        provider: RateProviderEnum.A,
      } as ExchangeRate);

      const res = await service.selectProviderForExchangeRate(from, to);

      expect(res).toStrictEqual(RateProviderEnum.A);
      expect(exchangesService.findAssetByNameOrFail).toHaveBeenCalledTimes(2);
      expect(exchangesService.findAssetByNameOrFail).toHaveBeenCalledWith(from);
      expect(exchangesService.findAssetByNameOrFail).toHaveBeenCalledWith(to);
      expect(exchangesService.findRateProvider).toHaveBeenCalledTimes(1);
      expect(exchangesService.findRateProvider).toHaveBeenCalledWith(id, id);
    });

    it('should not return a provider', async () => {
      const from = 'IRR';
      const to = 'BTC';
      jest
        .spyOn(exchangesService, 'findAssetByNameOrFail')
        .mockImplementation(async (name: string): Promise<Asset> => {
          if (name === 'IRR')
            return { id: 'id1', name, type: AssetType.FIAT } as Asset;
          return { id: 'id2', name, type: AssetType.CRYPTO } as Asset;
        });
      jest.spyOn(exchangesService, 'findRateProvider');

      expect(() =>
        service.selectProviderForExchangeRate(from, to),
      ).rejects.toThrow(BadRequestException);
      expect(exchangesService.findAssetByNameOrFail).toHaveBeenCalled();
      expect(exchangesService.findRateProvider).toHaveBeenCalledTimes(0);
    });
  });

  describe('selectRateProviderService', () => {
    it('should find the service', () => {
      const selectedService = service.selectRateProviderService(
        RateProviderEnum.A,
      );

      expect(selectedService).toStrictEqual(rateProviderAService);
    });
  });
});
