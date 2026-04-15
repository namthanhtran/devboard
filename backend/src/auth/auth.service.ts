import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { TIME_DURATION } from 'common/constants';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  generateTokens(user: User): {
    access_token: string;
    refresh_token: string;
    user: Partial<User>;
  } {
    const payload = { email: user.email, sub: user.id };

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '1d',
    });
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<Partial<User>> {
    const existedEmail = await this.prismaService.user.findUnique({
      where: {
        email: registerDto.email,
      },
    });
    if (existedEmail) {
      throw new ConflictException('Email has already exist!');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    try {
      const user = await this.prismaService.user.create({
        data: {
          email: registerDto.email,
          password: hashedPassword,
          name: registerDto.name,
        },
      });

      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      // Nếu có lỗi, kiểm tra xem có phải là lỗi Prisma P2002 (Trùng dữ liệu Unique) không
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email has already exist!');
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async login(loginDto: LoginDto) {
    const findUser = await this.findByEmail(loginDto.email);
    if (!findUser) throw new UnauthorizedException('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      findUser.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid email or password');

    const tokens = this.generateTokens(findUser);
    await this.prismaService.refreshToken.create({
      data: {
        token: tokens.refresh_token,
        userId: findUser.id,
        expiresAt: new Date(Date.now() + TIME_DURATION.A_WEEK),
      },
    });

    return tokens;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const findRefreshToken = await this.prismaService.refreshToken.findUnique({
      where: { token: refreshTokenDto.refreshToken },
      include: { user: true },
    });
    if (!findRefreshToken) {
      throw new UnauthorizedException('Token not found');
    }

    if (findRefreshToken.expiresAt < new Date()) {
      await this.prismaService.refreshToken.delete({
        where: { id: findRefreshToken.id },
      });
      throw new UnauthorizedException('Token has expired');
    }

    const tokens = this.generateTokens(findRefreshToken.user);
    await this.prismaService.refreshToken.update({
      where: { id: findRefreshToken.id },
      data: {
        token: tokens.refresh_token,
        expiresAt: new Date(Date.now() + TIME_DURATION.A_WEEK),
      },
    });

    return tokens;
  }
}
