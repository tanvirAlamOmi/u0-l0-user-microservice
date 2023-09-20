import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateDto {
    @IsOptional()
    name: string;

    @IsOptional()
    username: string;
    
    @IsOptional()
    email: string;

    @IsOptional()
    phone: string;

    @IsOptional()
    password: string;

    @IsOptional()
    role: string;
    
    @IsOptional()
    refreshToken: string;

    @IsArray()
    @IsString({ each: true })
    permissions: string[];
}