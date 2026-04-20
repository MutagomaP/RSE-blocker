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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const api_service_1 = require("../../common/api.service");
let AuthController = class AuthController {
    constructor(apiService) {
        this.apiService = apiService;
    }
    loginPage(redirect, error) {
        return { title: 'Login — RSE', redirect, error, page: 'login' };
    }
    async loginAction(body, res) {
        try {
            const result = await this.apiService.login({ email: body.email, password: body.password });
            res.cookie('rse_token', result.accessToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: 'lax',
            });
            return res.redirect(body.redirect || '/dashboard');
        }
        catch (err) {
            const message = err?.response?.data?.message || 'Invalid credentials';
            return res.redirect(`/auth/login?error=${encodeURIComponent(message)}`);
        }
    }
    registerPage(error) {
        return { title: 'Create Account — RSE', error, page: 'register' };
    }
    async registerAction(body, res) {
        try {
            const result = await this.apiService.register(body);
            res.cookie('rse_token', result.accessToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: 'lax',
            });
            return res.redirect('/dashboard');
        }
        catch (err) {
            const message = err?.response?.data?.message || 'Registration failed';
            return res.redirect(`/auth/register?error=${encodeURIComponent(message)}`);
        }
    }
    logout(res) {
        res.clearCookie('rse_token');
        return res.redirect('/');
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('login'),
    (0, common_1.Render)('auth/login'),
    __param(0, (0, common_1.Query)('redirect')),
    __param(1, (0, common_1.Query)('error')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "loginPage", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginAction", null);
__decorate([
    (0, common_1.Get)('register'),
    (0, common_1.Render)('auth/register'),
    __param(0, (0, common_1.Query)('error')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "registerPage", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerAction", null);
__decorate([
    (0, common_1.Get)('logout'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [api_service_1.ApiService])
], AuthController);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({ controllers: [AuthController] })
], AuthModule);
//# sourceMappingURL=auth.module.js.map