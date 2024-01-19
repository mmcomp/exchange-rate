import { Injectable } from '@nestjs/common';
import { RateProviderService } from './rate-provider.interface';

@Injectable()
export class RateProviderBService implements RateProviderService {
  getRate(from: string, to: string): Promise<number> {
    return Promise.resolve(2.5);
  }
}
