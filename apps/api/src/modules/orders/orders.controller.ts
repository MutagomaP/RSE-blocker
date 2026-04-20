import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Get my orders' })
  getMyOrders(@Request() req) {
    return this.ordersService.getMyOrders(req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a pending order' })
  cancelOrder(@Request() req, @Param('id') id: string) {
    return this.ordersService.cancelOrder(id, req.user.id);
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BROKER)
  @ApiOperation({ summary: 'Get all orders (broker/admin)' })
  getAllOrders(@Request() req) {
    const brokerId = req.user.role === UserRole.BROKER ? req.user.id : undefined;
    return this.ordersService.getAllOrders(brokerId);
  }
}
