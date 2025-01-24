import {
  ExecutionContext,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CustomLoggerService } from '../../custom-logger/custom-logger.service';

@Injectable({ scope: Scope.REQUEST })
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private readonly loggerService: CustomLoggerService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    this.loggerService.log('START LocalAuthGuard canActivate...');

    this.loggerService.verbose('START super.canActivate...');
    const result = (await super.canActivate(context)) as boolean;
    this.loggerService.verbose('END super.canActivate...');

    this.loggerService.verbose('START super.logIn...');
    await super.logIn(context.switchToHttp().getRequest());
    this.loggerService.verbose('END super.logIn...');

    this.loggerService.log('END LocalAuthGuard canActivate...');
    return result;
  }

  handleRequest(err: any, user: any, info: any) {
    this.loggerService.log('START LocalAuthGuard handleRequest...');

    if (info) this.loggerService.verbose(`info: `, info);
    if (user) this.loggerService.debug('user: ', user);
    if (err) this.loggerService.debug(`err: ${err}`);
    // if (err)
    //   this.errorHandlerService.unauthorizedException({
    //     statusCode: 401,
    //     message: 'Unauthorized',
    //     err,
    //     info,
    //   });
    if (!user) throw new UnauthorizedException();
    // if (!user) this.errorHandlerService.unauthorizedException();

    this.loggerService.log('END LocalAuthGuard handleRequest...');
    return user;
  }
}
