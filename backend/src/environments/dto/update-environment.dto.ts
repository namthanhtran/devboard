import { PartialType } from '@nestjs/swagger';
import { CreateEnvironmentDto } from './create-environments.dto';

export class UpdateEnvironmentDto extends PartialType(CreateEnvironmentDto) {}
