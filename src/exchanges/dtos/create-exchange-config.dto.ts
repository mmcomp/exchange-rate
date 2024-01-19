import { ApiProperty } from '@nestjs/swagger';
import { RateProviderEnum } from '../enums/rate-provider.enum';

export class CreateExchangeConfig {
  @ApiProperty({
    example: '8fa1d9ce-194b-47bb-a040-60704bcff570',
    description: 'From asset id',
  })
  fromAssetId: string;

  @ApiProperty({
    example: '680b8b6b-e58c-4d65-b97f-28ec16acefc9',
    description: 'To asset id',
  })
  toAssetId: string;

  @ApiProperty({
    example: RateProviderEnum.A,
    description: 'The exchange rate provider',
  })
  provider: RateProviderEnum;
}
