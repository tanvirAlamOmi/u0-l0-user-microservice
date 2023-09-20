import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities';
import { Model } from 'mongoose'
import { UpdateDto, UserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly model: Model<UserDocument>,
        // @Inject('KAFKA_SERVICE') private readonly client: ClientKafka
    ){}

    // @MessagePattern('get_users_topic') // Listening to this Kafka topic
    // async getUsers(@Payload() data: any): Promise<User[]> {
    //     // Your logic to get users
    //     const users = await this.model.find().exec();
    //     return users;
    // }
    
    async findAll(): Promise<User[]> {
        return await this.model.find().exec(); 
    }

    async findOne(id: string): Promise<User> {
        let user = await this.model.findById(id).exec();
        if(!user) throw new NotFoundException('could not find the user.')
        return user.toJSON();
    }

    async findByUsername(username: string): Promise<User> {
        const user = await this.model.findOne({username}).exec();
        if(!user) throw new NotFoundException('could not find the user.')
        return user;
    }

    async findByQuery (query: object) : Promise<User | undefined> {
        
        let user = await this.model.findOne(query);
        if(!user) throw new NotFoundException('could not find the user.')
        return user;
    }

    async create(userDto: UserDto): Promise<User> {
        let {password, ...rest} = userDto;

        const hash = await this.bcryptHash(password);
        
        return await new this.model({
          ...rest,
          password: hash,
          createdAt: new Date(),
        }).save();
    }

    async update(id: string, updateDto: any): Promise<UserDto> {
        let user = await this.model.findOneAndUpdate({_id: id}, {$set: updateDto}, {new: true}).exec();
        if(!user) throw new NotFoundException('could not find the user.')
        return user.toJSON();
    }

    // async replace(id: string, updateDto: UpdateDto): Promise<UpdateDto> {
    //     let user = await this.model.findOneAndReplace({id}, updateDto).exec();
    //     if(!user) throw new NotFoundException('could not find the user.')
    //     return user;
    // }

    async delete(id: string): Promise<UserDto> {
        let user = await this.model.findByIdAndDelete(id).exec();
        if(!user) throw new NotFoundException('could not find the user.')
        return user.toJSON();
    }

    async updateRefreshToken( userId: string, tokens: any) {
        const refreshToken = tokens ?  await this.bcryptHash(tokens.refresh_token) : null;
        await this.update(userId, {refreshToken});
    }

    async bcryptHash (plainText: string): Promise<string> {
        const saltOrRounds = await bcrypt.genSalt();
        return await bcrypt.hash(plainText, saltOrRounds);
    }
}
