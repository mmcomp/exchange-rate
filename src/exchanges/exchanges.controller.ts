import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ExchangesService } from './exchanges.service';
import { CreateExchangeConfig } from './dtos/create-exchange-config.dto';
import { ExchangeRate } from './entities/exchange-rate.entity';
import { Asset } from './entities/asset.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAsset } from './dtos/create-asset.dto';

@Controller('exchanges')
export class ExchangesController {
  constructor(private readonly exchangesService: ExchangesService) {}

  @ApiTags('Exchanges')
  @ApiOperation({
    summary: 'Get Exchange rate configurations',
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  getExchangeRateConfigs(): Promise<ExchangeRate[]> {
    return this.exchangesService.getExchangeRateConfigs();
  }

  @ApiTags('Exchanges')
  @ApiOperation({
    summary: 'Add a new Exchange Rate provider configuration',
  })
  @HttpCode(HttpStatus.OK)
  @Post()
  createSymbolRateConfig(
    @Body() conf: CreateExchangeConfig,
  ): Promise<ExchangeRate> {
    return this.exchangesService.createSymbolRateConfig(conf);
  }

  @ApiTags('Assets')
  @ApiOperation({
    summary: 'Get Assets',
  })
  @HttpCode(HttpStatus.OK)
  @Get('assets')
  getAssets(): Promise<Asset[]> {
    return this.exchangesService.getAssets();
  }

  @ApiTags('Assets')
  @ApiOperation({
    summary: 'Add a new Asset',
  })
  @HttpCode(HttpStatus.OK)
  @Post('assets')
  createAsset(@Body() request: CreateAsset): Promise<Asset> {
    return this.exchangesService.createAsset(request);
  }
}
