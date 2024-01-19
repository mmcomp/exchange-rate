import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { RatesService } from './rates.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Rates')
@Controller('rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @ApiOperation({
    summary: 'Get Exchange rate between to currencies',
  })
  @ApiParam({
    name: 'from',
    example: 'IRR',
  })
  @ApiParam({
    name: 'to',
    example: 'USD',
  })
  @HttpCode(HttpStatus.OK)
  @Get('from/:from/to/:to/rate')
  getExchangeRate(
    @Param('from') from: string,
    @Param('to') to: string,
  ): Promise<{ rate: number }> {
    return this.ratesService.calculateExchangeRate(from, to);
  }
}
