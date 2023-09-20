import {Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { PermissionsEnum, RolesEnum } from 'src/common/enums';

export type UserDocument = User & Document

@Schema({ timestamps: true })
export class User extends Document{
    @Prop({required:true})
    name: string;

    @Prop({
        required:true,
        unique:true
    })
    username: string;

    @Prop({
        required:true,
        unique:true
    })
    email: string;

    @Prop({unique:true})
    phone: string;

    @Prop({required:true})
    password: string;
    
    @Prop({ 
        enum: RolesEnum, 
        default:RolesEnum.USER 
    })
    role: string;

    @Prop({ 
        type: [String], 
        enum: PermissionsEnum 
    })
    permissions: string[];

    @Prop()
    refreshToken: string;
   
    @Prop()
    resetToken?: string;

    @Prop()
    resetTokenExpiration?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);