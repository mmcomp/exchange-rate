import { Injectable } from '@nestjs/common';
import { RateProviderService } from './rate-provider.interface';

@Injectable()
export class RateProviderCService implements RateProviderService {
  getRate(from: string, to: string): Promise<number> {
    return Promise.resolve(3.5);
  }
}
