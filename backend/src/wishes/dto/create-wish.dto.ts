import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateWishDto {
  @Length(1, 250)
  name: string; // название подарка

  @IsUrl()
  link: string; // ссылка на интернет-магазин, в котором можно приобрести подарок

  @IsUrl()
  @IsOptional()
  image?: string; // ссылка на изображение подарка

  @IsNumber()
  @IsPositive()
  price: number; // стоимость подарка

  @Length(1, 1024)
  @IsOptional()
  description?: string; // строка с описанием подарка
}
