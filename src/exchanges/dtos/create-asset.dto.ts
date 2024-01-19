import { ApiProperty } from '@nestjs/swagger';
import { AssetType } from '../enums/asset-type.enum';
import { IsEnum, IsString, MinLength } from 'class-validator';

export class CreateAsset {
  @IsString()
  @MinLength(3)
  @ApiProperty({
    example: 'IRR',
    description: 'The name of the Asset',
  })
  name: string;

  @IsEnum(AssetType)
  @ApiProperty({
    example: AssetType.FIAT,
    description: 'The type of the Asset',
    enum: AssetType,
    type: 'enum',
  })
  type: AssetType;
}
