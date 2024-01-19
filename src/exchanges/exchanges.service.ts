import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ExchangeRate } from './entities/exchange-rate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExchangeConfig } from './dtos/create-exchange-config.dto';
import { Asset } from './entities/asset.entity';
import { CreateAsset } from './dtos/create-asset.dto';

@Injectable()
export class ExchangesService {
  constructor(
    @InjectRepository(ExchangeRate)
    private readonly exchangeRateRepo: Repository<ExchangeRate>,
    @InjectRepository(Asset)
    private readonly assetRepo: Repository<Asset>,
  ) {}

  async findRateProvider(
    fromAssetId: string,
    toAssetId: string,
  ): Promise<ExchangeRate> {
    if (!fromAssetId && !toAssetId) {
      throw new BadRequestException(
        'You need to specify at least one currency',
      );
    }

    const exactCombination = await this.exchangeRateRepo.findOne({
      where: {
        fromAssetId,
        toAssetId,
      },
    });

    if (exactCombination) {
      return exactCombination;
    }

    const fromOnly = await this.exchangeRateRepo.findOne({
      where: {
        fromAssetId,
        toAssetId: null,
      },
    });

    if (fromOnly) {
      return fromOnly;
    }

    const toOnly = await this.exchangeRateRepo.findOne({
      where: {
        fromAssetId: null,
        toAssetId,
      },
    });

    if (toOnly) {
      return toOnly;
    }

    throw new NotFoundException('No rate provider config found for this');
  }

  async createSymbolRateConfig(
    conf: CreateExchangeConfig,
  ): Promise<ExchangeRate> {
    const fromAssetId = conf.fromAssetId || null;
    if (fromAssetId) {
      await this.findAssetByIdOrFail(fromAssetId);
    }
    const toAssetId = conf.toAssetId || null;
    if (toAssetId) {
      await this.findAssetByIdOrFail(toAssetId);
    }
    const find = await this.exchangeRateRepo.findOne({
      where: { fromAssetId, toAssetId },
    });
    if (find && find.provider !== conf.provider) {
      throw new BadRequestException(
        'We have another provider assign to this situation',
      );
    }
    if (find) {
      return find;
    }

    const exchangeRate = new ExchangeRate();
    exchangeRate.fromAssetId = fromAssetId;
    exchangeRate.toAssetId = toAssetId;
    exchangeRate.provider = conf.provider;
    await this.exchangeRateRepo.save(exchangeRate);

    return exchangeRate;
  }

  getExchangeRateConfigs(): Promise<ExchangeRate[]> {
    return this.exchangeRateRepo.find();
  }

  getAssets(): Promise<Asset[]> {
    return this.assetRepo.find();
  }

  async createAsset({ name, type }: CreateAsset): Promise<Asset> {
    const find = await this.assetRepo.findOne({
      where: {
        name,
        type,
      },
    });

    if (find) {
      throw new BadRequestException('Asset already exists');
    }

    const asset = new Asset();
    asset.name = name;
    asset.type = type;

    await this.assetRepo.save(asset);

    return asset;
  }

  async findAssetByIdOrFail(id: string): Promise<Asset> {
    const asset = await this.assetRepo.findOne({ where: { id } });
    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    return asset;
  }

  async findAssetByNameOrFail(name: string): Promise<Asset> {
    const asset = await this.assetRepo.findOne({ where: { name } });
    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    return asset;
  }
}
