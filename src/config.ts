import 'dotenv/config';

type EnvironmentVariable = string | undefined;

export const CLIENT_NAME: EnvironmentVariable = process.env.CLIENT_NAME;
export const CLIENT_ID: EnvironmentVariable = process.env.CLIENT_ID;
export const CLIENT_SECRET: EnvironmentVariable = process.env.CLIENT_SECRET;
export const BOT_TOKEN: EnvironmentVariable = process.env.BOT_TOKEN;
export const LOLOG_BACKEND: EnvironmentVariable = process.env.LOLOG_BACKEND;
