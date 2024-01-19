import { Test, TestingModule } from '@nestjs/testing';
import { ExchangesService } from './exchanges.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExchangeRate } from './entities/exchange-rate.entity';
import { Asset } from './entities/asset.entity';
import { Repository } from 'typeorm';
import { RateProviderEnum } from './enums/rate-provider.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AssetType } from './enums/asset-type.enum';

describe('ExchangesService', () => {
  let service: ExchangesService;
  let exchangeRateRepo: Repository<ExchangeRate>;
  let assetRepo: Repository<Asset>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(ExchangeRate),
          useFactory: () => ({
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
          }),
        },
        {
          provide: getRepositoryToken(Asset),
          useFactory: () => ({
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
          }),
        },
        ExchangesService,
      ],
    }).compile();

    service = module.get<ExchangesService>(ExchangesService);
    exchangeRateRepo = module.get<Repository<ExchangeRate>>(
      getRepositoryToken(ExchangeRate),
    );
    assetRepo = module.get<Repository<Asset>>(getRepositoryToken(Asset));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findRateProvider', () => {
    it('should return exchange rate configuration with both from and to set', async () => {
      const fromAssetId = 'from';
      const toAssetId = 'to';
      const exchangeRate = new ExchangeRate();
      exchangeRate.fromAssetId = fromAssetId;
      exchangeRate.toAssetId = toAssetId;
      exchangeRate.provider = RateProviderEnum.A;
      jest.spyOn(exchangeRateRepo, 'findOne').mockResolvedValue(exchangeRate);

      const res = await service.findRateProvider(fromAssetId, toAssetId);

      expect(res).toStrictEqual(exchangeRate);
      expect(exchangeRateRepo.findOne).toHaveBeenCalledTimes(1);
      expect(exchangeRateRepo.findOne).toHaveBeenCalledWith({
        where: {
          fromAssetId,
          toAssetId,
        },
      });
    });

    it('should return exchange rate configuration with only from set', async () => {
      const fromAssetId = 'from';
      const toAssetId = null;
      const exchangeRate = new ExchangeRate();
      exchangeRate.fromAssetId = fromAssetId;
      exchangeRate.toAssetId = toAssetId;
      exchangeRate.provider = RateProviderEnum.A;
      jest.spyOn(exchangeRateRepo, 'findOne').mockResolvedValue(exchangeRate);

      const res = await service.findRateProvider(fromAssetId, toAssetId);

      expect(res).toStrictEqual(exchangeRate);
      expect(exchangeRateRepo.findOne).toHaveBeenCalledTimes(1);
      expect(exchangeRateRepo.findOne).toHaveBeenCalledWith({
        where: {
          fromAssetId,
          toAssetId,
        },
      });
    });

    it('should return exchange rate configuration with only to set', async () => {
      const fromAssetId = null;
      const toAssetId = 'to';
      const exchangeRate = new ExchangeRate();
      exchangeRate.fromAssetId = fromAssetId;
      exchangeRate.toAssetId = toAssetId;
      exchangeRate.provider = RateProviderEnum.A;
      jest.spyOn(exchangeRateRepo, 'findOne').mockResolvedValue(exchangeRate);

      const res = await service.findRateProvider(fromAssetId, toAssetId);

      expect(res).toStrictEqual(exchangeRate);
      expect(exchangeRateRepo.findOne).toHaveBeenCalledTimes(1);
      expect(exchangeRateRepo.findOne).toHaveBeenCalledWith({
        where: {
          fromAssetId,
          toAssetId,
        },
      });
    });

    it('should fail because to and from assets are both null', async () => {
      const fromAssetId = null;
      const toAssetId = null;
      jest.spyOn(exchangeRateRepo, 'findOne').mockResolvedValue(undefined);

      expect(() =>
        service.findRateProvider(fromAssetId, toAssetId),
      ).rejects.toThrow(BadRequestException);

      expect(exchangeRateRepo.findOne).toHaveBeenCalledTimes(0);
    });
  });

  describe('createSymbolRateConfig', () => {
    it('should create a new exchange rate configuration', async () => {
      const fromAssetId = 'from';
      const toAssetId = 'to';
      const provider = RateProviderEnum.A;
      const exchangeRate = new ExchangeRate();
      exchangeRate.fromAssetId = fromAssetId;
      exchangeRate.toAssetId = toAssetId;
      exchangeRate.provider = provider;

      jest.spyOn(exchangeRateRepo, 'findOne');
      jest.spyOn(exchangeRateRepo, 'save');
      jest.spyOn(assetRepo, 'findOne').mockResolvedValue({} as Asset);

      const res = await service.createSymbolRateConfig({
        fromAssetId,
        toAssetId,
        provider,
      });

      expect(res).toStrictEqual(exchangeRate);
      expect(assetRepo.findOne).toHaveBeenCalledTimes(2);
      expect(assetRepo.findOne).toHaveBeenCalledWith({
        where: { id: fromAssetId },
      });
      expect(assetRepo.findOne).toHaveBeenCalledWith({
        where: { id: toAssetId },
      });
      expect(exchangeRateRepo.findOne).toHaveBeenCalledTimes(1);
      expect(exchangeRateRepo.findOne).toHaveBeenCalledWith({
        where: { fromAssetId, toAssetId },
      });
      expect(exchangeRateRepo.save).toHaveBeenCalledTimes(1);
      expect(exchangeRateRepo.save).toHaveBeenCalledWith(exchangeRate);
    });

    it('should create a new exchange rate configuration without from', async () => {
      const fromAssetId = null;
      const toAssetId = 'to';
      const provider = RateProviderEnum.A;
      const exchangeRate = new ExchangeRate();
      exchangeRate.fromAssetId = fromAssetId;
      exchangeRate.toAssetId = toAssetId;
      exchangeRate.provider = provider;

      jest.spyOn(exchangeRateRepo, 'findOne');
      jest.spyOn(exchangeRateRepo, 'save');
      jest.spyOn(assetRepo, 'findOne').mockResolvedValue({} as Asset);

      const res = await service.createSymbolRateConfig({
        fromAssetId,
        toAssetId,
        provider,
      });

      expect(res).toStrictEqual(exchangeRate);
      expect(assetRepo.findOne).toHaveBeenCalledTimes(1);
      expect(assetRepo.findOne).toHaveBeenCalledWith({
        where: { id: toAssetId },
      });
      expect(exchangeRateRepo.findOne).toHaveBeenCalledTimes(1);
      expect(exchangeRateRepo.findOne).toHaveBeenCalledWith({
        where: { fromAssetId, toAssetId },
      });
      expect(exchangeRateRepo.save).toHaveBeenCalledTimes(1);
      expect(exchangeRateRepo.save).toHaveBeenCalledWith(exchangeRate);
    });

    it('should create a new exchange rate configuration without to', async () => {
      const fromAssetId = 'from';
      const toAssetId = null;
      const provider = RateProviderEnum.A;
      const exchangeRate = new ExchangeRate();
      exchangeRate.fromAssetId = fromAssetId;
      exchangeRate.toAssetId = toAssetId;
      exchangeRate.provider = provider;

      jest.spyOn(exchangeRateRepo, 'findOne');
      jest.spyOn(exchangeRateRepo, 'save');
      jest.spyOn(assetRepo, 'findOne').mockResolvedValue({} as Asset);

      const res = await service.createSymbolRateConfig({
        fromAssetId,
        toAssetId,
        provider,
      });

      expect(res).toStrictEqual(exchangeRate);
      expect(assetRepo.findOne).toHaveBeenCalledTimes(1);
      expect(assetRepo.findOne).toHaveBeenCalledWith({
        where: { id: fromAssetId },
      });
      expect(exchangeRateRepo.findOne).toHaveBeenCalledTimes(1);
      expect(exchangeRateRepo.findOne).toHaveBeenCalledWith({
        where: { fromAssetId, toAssetId },
      });
      expect(exchangeRateRepo.save).toHaveBeenCalledTimes(1);
      expect(exchangeRateRepo.save).toHaveBeenCalledWith(exchangeRate);
    });

    it('should not create a new exchange rate configuration', async () => {
      const fromAssetId = 'from';
      const toAssetId = 'to';
      const provider = RateProviderEnum.A;

      const existingExchangeRate = new ExchangeRate();
      existingExchangeRate.fromAssetId = fromAssetId;
      existingExchangeRate.toAssetId = toAssetId;
      existingExchangeRate.provider = RateProviderEnum.A;

      jest
        .spyOn(exchangeRateRepo, 'findOne')
        .mockResolvedValue(existingExchangeRate);
      jest.spyOn(assetRepo, 'findOne').mockResolvedValue({} as Asset);

      const res = await service.createSymbolRateConfig({
        fromAssetId,
        toAssetId,
        provider,
      });

      expect(res).toStrictEqual(existingExchangeRate);
      expect(assetRepo.findOne).toHaveBeenCalledTimes(2);
      expect(assetRepo.findOne).toHaveBeenCalledWith({
        where: { id: fromAssetId },
      });
      expect(assetRepo.findOne).toHaveBeenCalledWith({
        where: { id: toAssetId },
      });
      expect(exchangeRateRepo.findOne).toHaveBeenCalledTimes(1);
      expect(exchangeRateRepo.findOne).toHaveBeenCalledWith({
        where: { fromAssetId, toAssetId },
      });
      expect(exchangeRateRepo.save).toHaveBeenCalledTimes(0);
    });
  });

  describe('getExchangeRateConfigs', () => {
    it('should return all exchange rate configs', async () => {
      jest.spyOn(exchangeRateRepo, 'find');

      await service.getExchangeRateConfigs();

      expect(exchangeRateRepo.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAssets', () => {
    it('should return all assets', async () => {
      jest.spyOn(assetRepo, 'find');

      await service.getAssets();

      expect(assetRepo.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('createAsset', () => {
    it('should create a new asset', async () => {
      const name = 'BTC';
      const type = AssetType.CRYPTO;
      const asset = new Asset();
      asset.name = name;
      asset.type = type;

      jest.spyOn(assetRepo, 'findOne');
      jest.spyOn(assetRepo, 'save');

      const res = await service.createAsset({ name, type });

      expect(res).toStrictEqual(asset);
      expect(assetRepo.findOne).toHaveBeenCalledTimes(1);
      expect(assetRepo.findOne).toHaveBeenCalledWith({
        where: {
          name,
          type,
        },
      });
      expect(assetRepo.save).toHaveBeenCalledTimes(1);
      expect(assetRepo.save).toHaveBeenCalledWith(asset);
    });

    it('should not create an asset', async () => {
      const name = 'BTC';
      const type = AssetType.CRYPTO;
      const asset = new Asset();
      asset.name = name;
      asset.type = type;

      jest.spyOn(assetRepo, 'findOne').mockResolvedValue(asset);
      jest.spyOn(assetRepo, 'save');

      expect(() => service.createAsset({ name, type })).rejects.toThrow(
        BadRequestException,
      );
      expect(assetRepo.findOne).toHaveBeenCalledTimes(1);
      expect(assetRepo.findOne).toHaveBeenCalledWith({
        where: {
          name,
          type,
        },
      });
      expect(assetRepo.save).toHaveBeenCalledTimes(0);
    });
  });

  describe('findAssetByIdOrFail', () => {
    it('should find an asset', async () => {
      const name = 'BTC';
      const type = AssetType.CRYPTO;
      const id = 'id';
      const asset = new Asset();
      asset.name = name;
      asset.type = type;
      asset.id = id;

      jest.spyOn(assetRepo, 'findOne').mockResolvedValue(asset);

      const res = await service.findAssetByIdOrFail(id);

      expect(res).toStrictEqual(asset);
      expect(assetRepo.findOne).toHaveBeenCalledTimes(1);
      expect(assetRepo.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should not return as asset', async () => {
      const name = 'BTC';
      const type = AssetType.CRYPTO;
      const id = 'id';
      const asset = new Asset();
      asset.name = name;
      asset.type = type;
      asset.id = id;

      jest.spyOn(assetRepo, 'findOne');

      expect(() => service.findAssetByIdOrFail(id)).rejects.toThrow(
        NotFoundException,
      );
      expect(assetRepo.findOne).toHaveBeenCalledTimes(1);
      expect(assetRepo.findOne).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('findAssetByNameOrFail', () => {
    it('should find an asset', async () => {
      const name = 'BTC';
      const type = AssetType.CRYPTO;
      const id = 'id';
      const asset = new Asset();
      asset.name = name;
      asset.type = type;
      asset.id = id;

      jest.spyOn(assetRepo, 'findOne').mockResolvedValue(asset);

      const res = await service.findAssetByNameOrFail(name);

      expect(res).toStrictEqual(asset);
      expect(assetRepo.findOne).toHaveBeenCalledTimes(1);
      expect(assetRepo.findOne).toHaveBeenCalledWith({ where: { name } });
    });

    it('should not return as asset', async () => {
      const name = 'BTC';
      const type = AssetType.CRYPTO;
      const id = 'id';
      const asset = new Asset();
      asset.name = name;
      asset.type = type;
      asset.id = id;

      jest.spyOn(assetRepo, 'findOne');

      expect(() => service.findAssetByNameOrFail(name)).rejects.toThrow(
        NotFoundException,
      );
      expect(assetRepo.findOne).toHaveBeenCalledTimes(1);
      expect(assetRepo.findOne).toHaveBeenCalledWith({ where: { name } });
    });
  });
});
