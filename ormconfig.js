const { SnakeNamingStrategy } = require("typeorm-naming-strategies");

var sourceDir = process.env.NODE_ENV === "development" ? "src" : "dist";

module.exports = {
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  logging: true,

  cli: {
    migrationsDir: `${sourceDir}/infrastructure/database/migrations`,
  },

  entities: [`${sourceDir}/infrastructure/database/schemas/*.{js,ts}`],
  migrations: [`${sourceDir}/infrastructure/database/migrations/*.{js,ts}`],
  namingStrategy: new SnakeNamingStrategy(),
}