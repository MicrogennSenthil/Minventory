import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { tenantStorage } from '../common/tenant/tenant-context';

// Verifies the Bearer JWT and requires a tenant_id claim.
// The tenant is never read from the request body, query or headers.
@Injectable()
export class JwtTenantGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const header: string = req.headers['authorization'] || '';
    if (header.indexOf('Bearer ') !== 0) {
      throw new UnauthorizedException('Missing bearer token');
    }
    let payload: any;
    try {
      payload = this.jwt.verify(header.substring(7));
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
    if (!payload || !payload.tenant_id || !payload.sub) {
      throw new UnauthorizedException('Token has no tenant');
    }
    // Keep the tenant context for the rest of this request.
    tenantStorage.enterWith({ tenantId: String(payload.tenant_id), userId: String(payload.sub) });
    return true;
  }
}
