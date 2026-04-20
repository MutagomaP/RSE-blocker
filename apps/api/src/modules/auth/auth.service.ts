import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserStatus } from '../users/user.entity';
import { RegisterDto, LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 12);
    const user = this.usersRepository.create({
      ...dto,
      password: hashed,
      status: UserStatus.ACTIVE,
    });
    await this.usersRepository.save(user);

    const { password, ...result } = user;
    return { user: result, accessToken: this.signToken(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    if (user.status === UserStatus.SUSPENDED)
      throw new UnauthorizedException('Account suspended');

    const { password, ...result } = user;
    return { user: result, accessToken: this.signToken(user) };
  }

  async validateUser(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  private signToken(user: User) {
    return this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
  }
}
