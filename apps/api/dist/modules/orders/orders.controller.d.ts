import { OrdersService, PlaceOrderDto } from './orders.service';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    placeOrder(req: any, dto: PlaceOrderDto): Promise<import("./order.entity").Order>;
    getMyOrders(req: any): Promise<import("./order.entity").Order[]>;
    cancelOrder(req: any, id: string): Promise<{
        message: string;
    }>;
    getAllOrders(req: any): Promise<import("./order.entity").Order[]>;
}
