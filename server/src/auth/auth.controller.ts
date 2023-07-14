import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateSigninDto } from './dto/create-signin.dto';
import { CreateSignupDto } from './dto/create-signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  public async signup(@Body() createSignupDto: CreateSignupDto) {
    return this.authService.signup(createSignupDto);
  }

  @Post('signin')
  public async signin(@Body() createSigninDto: CreateSigninDto) {
    return this.authService.signin(createSigninDto);
  }
}
