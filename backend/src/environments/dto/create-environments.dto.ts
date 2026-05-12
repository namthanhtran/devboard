import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import Variable from 'common/types/Variables';

export class CreateEnvironmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  variables: Variable[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
