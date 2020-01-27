import 'dotenv/config';

type EnvironmentVariable = string | undefined;

export const CLIENT_NAME: EnvironmentVariable = process.env.CLIENT_NAME;
export const CLIENT_ID: EnvironmentVariable = process.env.CLIENT_ID;
export const CLIENT_SECRET: EnvironmentVariable = process.env.CLIENT_SECRET;
export const BOT_TOKEN: EnvironmentVariable = process.env.BOT_TOKEN;
export const LOLOG_BACKEND: EnvironmentVariable = process.env.LOLOG_BACKEND;
export const LOL_CLIENT_VERSION: EnvironmentVariable = process.env.LOL_CLIENT_VERSION;
export const MONGO_URL: EnvironmentVariable = process.env.MONGO_URL;
export const DATABASE_NAME: EnvironmentVariable = process.env.DATABASE_NAME;
