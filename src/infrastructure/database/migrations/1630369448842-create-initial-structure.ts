import {MigrationInterface, QueryRunner} from "typeorm";

export class createInitialStructure1630369448842 implements MigrationInterface {
    name = 'createInitialStructure1630369448842'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "color" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "owner_id" uuid, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "release_configurations" ("id" uuid NOT NULL, "name" character varying NOT NULL, "branch_from" character varying NOT NULL, "branch_to" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "project_id" uuid, CONSTRAINT "PK_36c8def164b2ba14edd3aa9e367" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "access_token" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_b1bd2fbf5d0ef67319c91acb5cf" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "release_configurations" ADD CONSTRAINT "FK_996733eb4d9dd939cc9b51f1cae" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "release_configurations" DROP CONSTRAINT "FK_996733eb4d9dd939cc9b51f1cae"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_b1bd2fbf5d0ef67319c91acb5cf"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "release_configurations"`);
        await queryRunner.query(`DROP TABLE "projects"`);
    }

}
