import { Body, Controller, Headers, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Public } from 'src/common/decorators/metadatas/auth';
import { GetCurrentUserId } from 'src/common/decorators/requests';
import { JwtRefreshAuthGuard } from 'src/common/guards/auth/jwt';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto, ResetPasswordDto } from './dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @MessagePattern('signup')
    async signup( @Body() signupDto: SignupDto ) {
        return await this.authService.signup(signupDto);
    }

    @Public()
    @MessagePattern('login')
    @HttpCode(HttpStatus.OK)
    async login( @Body() loginDto: LoginDto){
        return await this.authService.login(loginDto);
    }

    @MessagePattern('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@GetCurrentUserId() userId: string) {
        return this.authService.logout(userId);
    }

    @Public()
    @UseGuards(JwtRefreshAuthGuard)
    @MessagePattern('refresh')
    @HttpCode(HttpStatus.OK)
    async refreshTokens(@Req() req: Request) {
        const userToken = req.user;
        return this.authService.refreshTokens(userToken);
    }

    @Public()
    @MessagePattern('requestPasswordReset')
    async requestPasswordReset(@Body('username') username: string) {
        const resetToken = await this.authService.createPasswordResetToken(username);
        return this.authService.sendResetEmail(username, resetToken);
    }

    @Public()
    @MessagePattern('resetPassword')
    async resetPassword(@Body() resetDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetDto.token, resetDto.newPassword);
    }
}
