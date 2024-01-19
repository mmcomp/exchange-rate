import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AssetType } from '../enums/asset-type.enum';
import { ExchangeRate } from './exchange-rate.entity';

@Entity()
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10, nullable: false, unique: true })
  name: string;

  @Column({ type: 'enum', enum: AssetType, nullable: false })
  type: AssetType;

  @OneToMany(() => ExchangeRate, (exchangeRate) => exchangeRate.fromAsset)
  fromRates: ExchangeRate[];

  @OneToMany(() => ExchangeRate, (exchangeRate) => exchangeRate.toAsset)
  toRates: ExchangeRate[];
}
