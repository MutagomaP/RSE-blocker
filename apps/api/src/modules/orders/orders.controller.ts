import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { OrdersService, PlaceOrderDto } from './orders.service';
import { JwtAuthGuard, RolesGuard, Roles } from '../auth/guards';
import { UserRole } from '../users/user.entity';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Place a buy or sell order' })
  placeOrder(@Request() req, @Body() dto: PlaceOrderDto) {
    return this.ordersService.placeOrder(req.user.id, dto);
  }

  @Get('my-orders')
  @ApiOperation({ summary: 'Get my orders (investor view)' })
  getMyOrders(@Request() req) {
    return this.ordersService.getMyOrders(req.user.id);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BROKER)
  @ApiOperation({ summary: 'Get order statistics (admin/broker)' })
  getStats() {
    return this.ordersService.getOrderStats();
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BROKER)
  @ApiOperation({ summary: 'Get all orders — admin sees all, broker sees orders routed to them' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'side', required: false })
  getAllOrders(
    @Request() req,
    @Query('status') status?: string,
    @Query('side') side?: string,
  ) {
    const isAdmin = req.user.role === UserRole.ADMIN;
    return this.ordersService.getAllOrders({ isAdmin, userId: req.user.id, status, side });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a pending order' })
  cancelOrder(@Request() req, @Param('id') id: string) {
    return this.ordersService.cancelOrder(id, req.user.id);
  }
}