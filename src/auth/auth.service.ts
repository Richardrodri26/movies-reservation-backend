import { Injectable, InternalServerErrorException, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { envs } from 'src/config/envs';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { tryCatch } from 'src/common/utils';
import { HASH_ADAPTER } from 'src/adapters';
import type { IHashAdapter } from 'src/adapters';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
    @Inject(HASH_ADAPTER) private readonly hashAdapter: IHashAdapter,
  ) {}

  async register(registerDto: RegisterDto) {
    const { password, email } = registerDto;

    const [user, userError] = await tryCatch(() => {
      return this.prisma.user.findUnique({
        where: { email },
      })
    });

    if (userError) {
      throw new InternalServerErrorException('Error checking existing user');
    }

    if (user) {
      throw new UnauthorizedException('User already exists');
    }

    // Hash the password before persisting
    const [hashed, hashedErr] = await tryCatch(() => this.hashAdapter.hash(password));
    if (hashedErr || !hashed) {
      throw new InternalServerErrorException('Error hashing password');
    }

    const [created, createErr] = await tryCatch(() =>
      this.prisma.user.create({
        data: {
          ...registerDto,
          password: hashed,
        },
      }),
    );

    if (createErr || !created) {
      throw new InternalServerErrorException('Error creating user');
    }

    // Do not return password to callers
    const { password: _p, ...safe } = created as any;
    return safe;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const [user, userErr] = await tryCatch(() =>
      this.prisma.user.findUnique({ where: { email } }),
    );

    if (userErr) throw new InternalServerErrorException('Error finding user');
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const [match, matchErr] = await tryCatch(() =>
      this.hashAdapter.compare(password, user.password),
    );

    if (matchErr) throw new InternalServerErrorException('Error validating credentials');
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const token = await this.signToken(user.id, user.name);

    const { password: _p, ...safe } = user as any;

    return { user: safe, token };
  }

  
  /**
   * 🔏 Generar JWT
   */
  async signToken(userId: string, username: string) {
    const payload = { sub: userId, userId, username };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
      secret: envs.jwtSecret,
    });

    return token;
  }

  /**
   * 🧠 Validar usuario por ID (usado por estrategias JWT)
   */
  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new UnauthorizedException('Token inválido');
    return user;
  }

}
