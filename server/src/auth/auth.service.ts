import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateSigninDto } from './dto/create-signin.dto';
import { CreateSignupDto } from './dto/create-signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ){}

  async generateToken(obj: { id: number}){
    const token = await this.jwt.signAsync(obj);
    return token;
  }

  async signup(createSignupDto: CreateSignupDto) {
    const { email, password } = createSignupDto;

    // is user already exist 
    const isUserExist = await this.prisma.user.findUnique({
      where: { 
        email
      }
    })

    if(isUserExist){
      return({
        status: false,
        message: 'User with this email already exist !'
      })
    }
    // Hashing password
    const hashedPassword = await bcrypt.hashSync(password, 10);

    // creating new user
    const user = await this.prisma.user.create({
      data: {
        ...createSignupDto,
        password: hashedPassword
      }
    })

    const token = await this.generateToken({ id: user.id });

    return {
      status: true,
      message: 'Successfully signed up !',
      token
    };
  }

  async signin(createSigninDto: CreateSigninDto){
    const { email, password } = createSigninDto;

    // is user exist or not 
    const isUserExist = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    if(!isUserExist){
      return({
        status: false,
        message: 'User with this email not exist !'
      })
    }

    const isValidPassword = bcrypt.compareSync(password, isUserExist.password);

    if(!isValidPassword){
      return({
        status: false,
        message: 'Incorrect password !'
      })
    }

    const token = await this.generateToken({ id: isUserExist.id });

    return {
      status: true,
      message: 'Successfully signed in !',
      token
    };
  }
}
