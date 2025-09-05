import { IsBoolean, IsNumber, IsPositive } from 'class-validator';

export class CreateOfferDto {
  @IsPositive()
  amount: number;
  @IsBoolean()
  hidden: boolean;
  @IsNumber()
  itemId: number;
}
