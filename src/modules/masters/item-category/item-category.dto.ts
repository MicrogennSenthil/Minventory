import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateItemCategoryDto {
  @IsString() @MinLength(1) @MaxLength(40) code: string;
  @IsString() @MinLength(1) @MaxLength(200) name: string;
  @IsOptional() @IsBoolean() is_active?: boolean;
}

export class UpdateItemCategoryDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(40) code?: string;
  @IsOptional() @IsString() @MinLength(1) @MaxLength(200) name?: string;
  @IsOptional() @IsBoolean() is_active?: boolean;
}
