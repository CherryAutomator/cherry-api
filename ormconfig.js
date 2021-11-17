const { SnakeNamingStrategy } = require("typeorm-naming-strategies");

var sourceDir = process.env.NODE_ENV === "development" ? "src" : "dist";

var config = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  logging: true,

  cli: {
    migrationsDir: `${sourceDir}/infrastructure/database/migrations`,
  },

  entities: [`${sourceDir}/infrastructure/database/schemas/*.{js,ts}`],
  migrations: [`${sourceDir}/infrastructure/database/migrations/*.{js,ts}`],
  namingStrategy: new SnakeNamingStrategy(),
}

if (process.env.NODE_ENV !== "development") {
  config.ssl = {
    rejectUnauthorized: false,
  };
}

module.exports = config;