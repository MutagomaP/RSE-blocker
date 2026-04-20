"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecuritiesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const security_entity_1 = require("./security.entity");
const securities_service_1 = require("./securities.service");
const securities_controller_1 = require("./securities.controller");
let SecuritiesModule = class SecuritiesModule {
};
exports.SecuritiesModule = SecuritiesModule;
exports.SecuritiesModule = SecuritiesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([security_entity_1.Security])],
        providers: [securities_service_1.SecuritiesService],
        controllers: [securities_controller_1.SecuritiesController],
        exports: [securities_service_1.SecuritiesService],
    })
], SecuritiesModule);
//# sourceMappingURL=securities.module.js.map