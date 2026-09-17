// Bundlers replace process.env.NODE_ENV at build time, so @types/node isn't needed
declare const process: { env: { NODE_ENV?: string } };
