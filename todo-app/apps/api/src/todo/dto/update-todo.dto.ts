import { Transform } from 'class-transformer';
import { IsString, IsBoolean, IsOptional, MinLength, MaxLength } from 'class-validator';
import { sanitizeString } from '../../common/utils/sanitize.util';

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  @MinLength(1, { message: 'Title cannot be empty' })
  @MaxLength(500, { message: 'Title cannot exceed 500 characters' })
  @Transform(({ value }) =>
    typeof value === 'string' ? sanitizeString(value) : value,
  )
  title?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
