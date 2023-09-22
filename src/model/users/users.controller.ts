import { Body, Controller, Get, Post, UseGuards, Request, Param, Patch, Put, Delete } from '@nestjs/common';
import { Roles } from 'src/common/decorators/metadatas/role';
import { Permissions } from 'src/common/decorators/metadatas/permission';
import { RolesEnum, PermissionsEnum } from 'src/common/enums';
import { RolesGuard } from 'src/common/guards/roles';
import { PermissionsGuard } from 'src/common/guards/permissions';
import { UpdateDto, UserDto } from './dto';
import { User } from './entities';
import { UsersService } from './users.service';
import { MessagePattern, Payload } from "@nestjs/microservices";
import { Public } from 'src/common/decorators/metadatas/auth';

@Controller()
export class UsersController {
    constructor( private readonly userService: UsersService ) {}

    @Public()
    @MessagePattern('getUsers')
    @UseGuards(RolesGuard)
    // @Roles(RolesEnum.ADMIN, RolesEnum.USER)
    async get(): Promise<User[]> {
        return await this.userService.findAll(); 
    } 

    @Public()
    @MessagePattern('getUser')
    // @UseGuards(RolesGuard, PermissionsGuard)
    // @Roles(RolesEnum.ADMIN, RolesEnum.USER)
    // @Permissions(PermissionsEnum.MASTER_USER)
    async getById(id: string): Promise<User> {
        return await this.userService.findOne(id);
    }


    @Public()
    @MessagePattern('updateUser')
    // @UseGuards(RolesGuard)
    // @Roles(RolesEnum.ADMIN)
    async update({ id, data }: { id: string, data: UpdateDto }): Promise<UserDto> {
        return await this.userService.update(id, data);
    }

    // @Put(':id')
    // async replace(@Param('id') id: string, @Body() userDto: UserDto): Promise<User> {
    //     return await this.service.replace(id, userDto); 
    // }


    @Public()
    @MessagePattern('deleteUser')
    async delete(id: string): Promise<UserDto>  {
        return await this.userService.delete(id);
    }
}
