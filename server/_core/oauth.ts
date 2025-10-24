import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  // 简单登录（用户名密码）
  app.post("/api/auth/simple-login", async (req: Request, res: Response) => {
    const { username, password } = req.body;

    // 简单验证（实际应该查询数据库并验证密码哈希）
    // 这里使用默认账号：admin / admin123
    if (username === "admin" && password === "admin123") {
      try {
        // 查找或创建管理员用户
        let user = await db.getUser("admin");
        if (!user) {
          await db.upsertUser({
            id: "admin",
            name: "管理员",
            email: null,
            loginMethod: "simple",
            role: "admin",
            lastSignedIn: new Date(),
          });
          user = await db.getUser("admin");
        } else {
          // 更新最后登录时间
          await db.upsertUser({
            ...user,
            lastSignedIn: new Date(),
          });
        }

        // 创建会话token
        const sessionToken = await sdk.createSessionToken("admin", {
          name: "管理员",
          expiresInMs: ONE_YEAR_MS,
        });

        const cookieOptions = getSessionCookieOptions(req);
        res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

        res.json({ success: true });
      } catch (error) {
        console.error("[Auth] Simple login failed", error);
        res.status(500).json({ error: "登录失败" });
      }
    } else {
      res.status(401).json({ error: "用户名或密码错误" });
    }
  });

  // OAuth登录入口（保留用于Manus环境）
  app.get("/api/auth/login", (req: Request, res: Response) => {
    const oauthPortalUrl = process.env.VITE_OAUTH_PORTAL_URL;
    if (!oauthPortalUrl) {
      // 如果没有配置OAuth，重定向到简单登录页面
      res.redirect(302, "/login");
      return;
    }
    res.redirect(302, oauthPortalUrl);
  });

  // OAuth回调
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        id: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}
