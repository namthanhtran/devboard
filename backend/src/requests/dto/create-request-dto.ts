import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { RequestBodyType } from 'common/enums';

export class CreateRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTION'])
  method: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsOptional()
  @IsObject()
  header?: Record<string, string>;

  @IsOptional()
  @IsObject()
  params?: Record<string, string>;

  @IsOptional()
  body?: any;

  @IsOptional()
  @IsString()
  @IsEnum(RequestBodyType, {
    message:
      'bodyType không hợp lệ. Chỉ chấp nhận: none, form-data, x-www-form-urlencoded, raw, graphql',
  })
  bodyType?: string;
}
