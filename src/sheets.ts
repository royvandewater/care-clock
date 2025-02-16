import { GoogleAuth } from "./google";
import { GoogleSpreadsheet } from "google-spreadsheet";

import { assert } from "./assert";

export const getSheetFromEnv = async (env: Record<string, string>) => {
  const doc = await getDoc(configurationFromEnv(env));
  await doc.loadInfo();
  return doc.sheetsByTitle["Activities"];
};

export const getClientFromEnv = async (env: Record<string, string>) => {
  return getDoc(configurationFromEnv(env));
};

const getDoc = async ({ email, privateKey, sheetId, scope }: { email: string; privateKey: string; sheetId: string; scope: string }) => {
  return new GoogleSpreadsheet(sheetId, new GoogleAuth({ email, privateKey, scope }));
};

const configurationFromEnv = (env: Record<string, string>) => {
  const email = env.GOOGLE_API_CLIENT_EMAIL;
  assert(email, "GOOGLE_API_CLIENT_EMAIL is not set");

  const privateKey = env.GOOGLE_API_PRIVATE_KEY?.replace(/\\n/g, "\n");
  assert(privateKey, "GOOGLE_API_PRIVATE_KEY is not set");

  const sheetId = env.GOOGLE_SHEET_ID;
  assert(sheetId, "GOOGLE_SHEET_ID is not set");

  const scope = "https://www.googleapis.com/auth/spreadsheets";

  return { email, privateKey, sheetId, scope };
};
