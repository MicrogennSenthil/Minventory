import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DbModule } from './common/db/db.module';
import { JwtTenantGuard } from './auth/jwt-tenant.guard';
import { ItemCategoryController } from './modules/masters/item-category/item-category.controller';
import { ItemCategoryService } from './modules/masters/item-category/item-category.service';

@Module({
  imports: [
    DbModule,
    JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '8h' } }),
  ],
  controllers: [ItemCategoryController],
  providers: [JwtTenantGuard, ItemCategoryService],
})
export class AppModule {}
