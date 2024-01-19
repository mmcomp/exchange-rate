import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RateProviderEnum } from '../enums/rate-provider.enum';
import { Asset } from './asset.entity';

@Entity()
export class ExchangeRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  fromAssetId: string;

  @Column({ nullable: true })
  toAssetId: string;

  @Column({ type: 'enum', enum: RateProviderEnum, nullable: false })
  provider: RateProviderEnum;

  @ManyToOne(() => Asset, (asset) => asset.fromRates)
  fromAsset: Asset;

  @ManyToOne(() => Asset, (asset) => asset.toRates)
  toAsset: Asset;
}
