import { Test, TestingModule } from '@nestjs/testing';
import { ExchangesController } from './exchanges.controller';
import { ExchangesService } from './exchanges.service';

describe('ExchangesController', () => {
  let controller: ExchangesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExchangesController],
      providers: [
        {
          provide: ExchangesService,
          useFactory: () => ({
            getExchangeRateConfigs: jest.fn(),
            createSymbolRateConfig: jest.fn(),
            getAssets: jest.fn(),
            createAsset: jest.fn(),
          }),
        },
      ],
    }).compile();

    controller = module.get<ExchangesController>(ExchangesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
