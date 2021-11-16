const { SnakeNamingStrategy } = require("typeorm-naming-strategies");

var sourceDir = process.env.NODE_ENV === "development" ? "src" : "dist";

console.log({
  type: "postgres",
  url: process.env.DATABASE_URL,
  logging: true,
});

module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  logging: true,
  ssl: {
    rejectUnauthorized: false,
  },

  cli: {
    migrationsDir: `${sourceDir}/infrastructure/database/migrations`,
  },

  entities: [`${sourceDir}/infrastructure/database/schemas/*.{js,ts}`],
  migrations: [`${sourceDir}/infrastructure/database/migrations/*.{js,ts}`],
  namingStrategy: new SnakeNamingStrategy(),
}