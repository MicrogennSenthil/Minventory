import { Injectable } from '@nestjs/common';
import { DbService } from '../../../common/db/db.service';
import { BaseMasterService } from '../base-master.service';

@Injectable()
export class ItemCategoryService extends BaseMasterService {
  protected readonly table = 'item_category';
  protected readonly columns = ['code', 'name', 'is_active'];

  constructor(db: DbService) {
    super(db);
  }
}
