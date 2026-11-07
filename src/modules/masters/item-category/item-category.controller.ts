import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtTenantGuard } from '../../../auth/jwt-tenant.guard';
import { CreateItemCategoryDto, UpdateItemCategoryDto } from './item-category.dto';
import { ItemCategoryService } from './item-category.service';

@Controller('api/v1/masters/item-categories')
@UseGuards(JwtTenantGuard)
export class ItemCategoryController {
  constructor(private readonly svc: ItemCategoryService) {}

  @Get() list() { return this.svc.list(); }
  @Get(':id') get(@Param('id', ParseUUIDPipe) id: string) { return this.svc.get(id); }
  @Post() create(@Body() dto: CreateItemCategoryDto) { return this.svc.create(dto); }
  @Patch(':id') update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateItemCategoryDto) { return this.svc.update(id, dto); }
  @Delete(':id') @HttpCode(204) remove(@Param('id', ParseUUIDPipe) id: string) { return this.svc.remove(id); }
}
