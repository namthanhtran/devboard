import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEnvironmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  variables: {
    key: string;
    value: string;
    enabled: boolean;
  }[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
