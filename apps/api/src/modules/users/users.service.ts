import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from './user.entity';
import { UpdateProfileDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  findAll() {
    return this.repo.find({ select: ['id', 'email', 'firstName', 'lastName', 'role', 'status', 'createdAt'] });
  }

  async findOne(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async suspendUser(id: string) {
    await this.repo.update(id, { status: UserStatus.SUSPENDED });
    return { message: 'User suspended' };
  }

  async activateUser(id: string) {
    await this.repo.update(id, { status: UserStatus.ACTIVE });
    return { message: 'User activated' };
  }
}
