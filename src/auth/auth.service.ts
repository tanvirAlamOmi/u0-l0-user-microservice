import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/model/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, SignupDto } from './dto';
import { User } from 'src/model/users/entities';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async validateUser(loginDto: LoginDto): Promise<User> {
        const { username, password } = loginDto;        
        const user = await this.userService.findByUsername(username);

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!(user && isPasswordMatch)){
            throw new UnauthorizedException();
        }
                
        // const {username, password, ...rest} = user;
        return user;
    } 

    async getTokens(user: User): Promise<{}> { //should get User type & return token type
        const payload = {
            sub: user.id, 
            info: {
                name:  user.name,
                role: user.role,
                permissions: user.permissions
            }
        }

        const [accessToken, refreshTokens] = await Promise.all([
            this.jwtService.signAsync(
                payload,
                {
                    secret: this.configService.get<string>('JWT_ACCESS_TOKEN'),
                    expiresIn: '15m',
                },
            ),
            this.jwtService.signAsync(
                payload,
                {
                    secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
                    expiresIn: '2w',
                }
            )
        ])

        return { 
            access_token: accessToken,
            refresh_token: refreshTokens,
        }

    }

    async login(loginDto: LoginDto): Promise<{}> {
        const user = await this.validateUser(loginDto);
        const tokens =  await this.getTokens(user);
        await this.userService.updateRefreshToken(user.id, tokens);
        return tokens;
    }

    async signup(signup: SignupDto): Promise<{}> {
        const user =  await this.userService.create(signup);
        const tokens =  await this.getTokens(user);
        await this.userService.updateRefreshToken(user['id'], tokens);
        return tokens;
    }

    async logout(userId: string) {
        const tokens = null;
        await this.userService.updateRefreshToken(userId, tokens);
        return 'logged out';
    }
    
    async refreshTokens(userToken: any) {
        const {sub, refreshToken} = userToken;
        const user = await this.userService.findOne(sub);
        if (!user || user.refreshToken) throw new ForbiddenException();
        
        const isMatched = await bcrypt.compare(refreshToken, user.refreshToken);

        if( !isMatched) throw new ForbiddenException();

        const tokens =  await this.getTokens(user);
        await this.userService.updateRefreshToken(user['id'], tokens);
        return tokens;
    }

    async createPasswordResetToken(username: string): Promise<string> {
        const user = await this.userService.findByUsername(username);
        
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const resetToken = uuidv4(); // generate a unique token
        user.resetToken = resetToken;
        user.resetTokenExpiration = new Date(Date.now() + 3600000); // token expires in 1 hour
        await this.userService.update(user.id, user);

        return resetToken;
    }

    async sendResetEmail(username: string, resetToken: string) {
        const resetLink = `http://your-frontend-url/reset-password?token=${resetToken}`;
        
        // Here you should implement sending an email to the user with the link.
        // Use a library or service like nodemailer, SendGrid, etc.

        return 'Email sent';
    }

    async resetPassword(token: string, newPassword: string) {
        const user = await this.userService.findByQuery({ resetToken: token });
        if (!user) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        user.password = await bcrypt.hash(newPassword, 12);
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();

        return 'Password reset successful';
    }
}
