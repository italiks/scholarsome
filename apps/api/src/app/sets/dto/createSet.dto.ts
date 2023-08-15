import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { CardValidator } from "../validator/card.validator";

export class CreateSetDto {
  @ApiProperty({
    description: "The title of the set",
    example: "Example set"
  })
  @IsString()
  @IsNotEmpty()
    title: string;

  @ApiProperty({
    description: "The description of the set",
    example: "This is an example of a set description",
    required: false
  })
  @IsString()
  @IsOptional()
    description: string;

  @ApiProperty({
    description: "Whether the set is private",
    example: true
  })
  @IsBoolean()
  @IsNotEmpty()
    private: boolean;

  @ApiProperty({
    description: "The cards contained within the set",
    type: [CardValidator]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CardValidator)
    cards: CardValidator[];
}