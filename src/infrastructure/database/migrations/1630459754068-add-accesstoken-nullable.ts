import {MigrationInterface, QueryRunner} from "typeorm";

export class addAccesstokenNullable1630459754068 implements MigrationInterface {
    name = 'addAccesstokenNullable1630459754068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users" ALTER COLUMN "access_token" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users" ALTER COLUMN "access_token" SET NOT NULL`);
    }
}
