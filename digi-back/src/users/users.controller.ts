import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Registration endpoint could be public or protected depending on requirements.
  // For now leaving it public to facilitate creating the first admin.
  @Post('register')
  async register(@Body() createUserDto: any) {
    return this.usersService.create(createUserDto);
  }
}
