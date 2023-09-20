import { IsEnum, IsNotEmpty, IsOptional, IsString, IsEmail, IsPhoneNumber, IsArray } from "class-validator";

export class UserDto {
    @IsString()
    name: string;

    @IsString()
    username: string;
    
    @IsEmail()
    email: string;

    @IsPhoneNumber('BD')
    phone: string;

    @IsString()
    password: string;

    @IsString()
    role: string;
    
    @IsArray()
    @IsString({ each: true })
    permissions: string[];

    @IsOptional()
    refreshToken: string;
}