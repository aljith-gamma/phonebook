import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwt: JwtService,
        private readonly prisma: PrismaService
    ){};

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request?.headers?.authorization?.split(' ').pop();
        if(!token) return false;
        return this.validateRequest(request, token);
    }

    async validateRequest(request, token: string) {
        try {
            const isValidToken = await this.jwt.verifyAsync(token);
            const user = await this.prisma.user.findUnique({ where: { id: isValidToken.id }});
            if(!user) return false;
            request.user = user;
            return true;
        } catch (err) {
            return false;
        }
    }
}