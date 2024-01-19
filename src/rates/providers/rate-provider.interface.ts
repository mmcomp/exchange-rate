export interface RateProviderService {
  getRate(from: string, to: string): Promise<number>;
}
