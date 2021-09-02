const { SnakeNamingStrategy } = require("typeorm-naming-strategies");

module.exports = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "123",
  database: "cherry",
  logging: true,

  cli: {
    migrationsDir: "src/infrastructure/database/migrations",
  },

  entities: ["src/infrastructure/database/schemas/*.ts"],
  migrations: ["src/infrastructure/database/migrations/*.{js,ts}"],
  namingStrategy: new SnakeNamingStrategy(),
}