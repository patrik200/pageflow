import type { Response } from "express";
import type { GetServerSidePropsContext, Redirect } from "next";

import { CustomExpressRequest } from "types/customExpressRequest";

export type ServerSidePropsContext = Omit<GetServerSidePropsContext, "req" | "res" | "locale" | "params"> & {
  req: CustomExpressRequest;
  res: Response;
  locale: string;
  params?: Record<string, string | undefined>;
};

export type NextPageSystemResult = { redirect: Redirect } | { notFound: true };
