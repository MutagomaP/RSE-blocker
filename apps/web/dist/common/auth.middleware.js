"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const common_1 = require("@nestjs/common");
const api_service_1 = require("./api.service");
let AuthMiddleware = class AuthMiddleware {
    constructor(apiService) {
        this.apiService = apiService;
    }
    async use(req, res, next) {
        const token = req.cookies?.['rse_token'];
        if (token) {
            try {
                const user = await this.apiService.getMe(token);
                req.user = user;
                req.token = token;
                res.locals.user = user;
                res.locals.token = token;
                res.locals.isLoggedIn = true;
            }
            catch {
                res.clearCookie('rse_token');
                res.locals.isLoggedIn = false;
            }
        }
        else {
            res.locals.isLoggedIn = false;
        }
        next();
    }
};
exports.AuthMiddleware = AuthMiddleware;
exports.AuthMiddleware = AuthMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [api_service_1.ApiService])
], AuthMiddleware);
//# sourceMappingURL=auth.middleware.js.map