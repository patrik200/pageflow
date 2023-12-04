import { Controller, HttpException, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { setTokenCookies } from "@app/front-kit";

import { BaseExpressRequest } from "types/express";

import { UserTokenGeneratorTokens } from "../services/UserTokenGenerator";
import { UserTokenService } from "../services/UserToken";

@Controller("auth")
export class AuthController {
  constructor(private userTokenService: UserTokenService) {}

  @Post("authorize-by-email")
  @UseGuards(AuthGuard("email"))
  async authorizeByEmail(@Req() request: BaseExpressRequest, @Res({ passthrough: true }) response: Response) {
    const tokens = await this.userTokenService.generateJwtTokens(request.user.userId, request.user.clientId);
    await this.userTokenService.saveJwtToken(request.user.userId, request.user.clientId, tokens);
    new Authorizer().saveTokensToCookies(response, tokens);
    return { success: true, id: request.user.userId };
  }

  @Post("refresh")
  async refresh(@Req() req: BaseExpressRequest, @Res({ passthrough: true }) response: Response) {
    const refreshToken = req.cookies["refresh_token"];
    if (!refreshToken) throw new HttpException("Unauthorized", 401);

    const tokens = await this.userTokenService.refreshJwtToken(refreshToken);
    new Authorizer().saveTokensToCookies(response, tokens);

    return { token: tokens.accessJwtToken, refreshToken: tokens.refreshJwtToken };
  }

  @Post("logout")
  async logout(@Res({ passthrough: true }) response: Response) {
    new Authorizer().logout(response);
  }
}

class Authorizer {
  logout(response: Response) {
    const expires = new Date(0);
    response.cookie("token", "", { expires, httpOnly: true });
    response.cookie("refresh_token", "", { expires, httpOnly: true });
    response.cookie("token_proxy", "", { expires, httpOnly: false });
  }

  saveTokensToCookies(response: Response, tokens: UserTokenGeneratorTokens) {
    setTokenCookies({ token: tokens.accessJwtToken, refreshToken: tokens.refreshJwtToken }, response);
  }
}
