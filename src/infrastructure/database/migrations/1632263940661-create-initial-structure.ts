import {MigrationInterface, QueryRunner} from "typeorm";

export class createInitialStructure1632263940661 implements MigrationInterface {
    name = 'createInitialStructure1632263940661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL, "name" character varying(30) NOT NULL, "description" character varying(128) NOT NULL, "color" character varying(20) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "external_repository_id" character varying(60) NOT NULL, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "release_configurations" ("id" uuid NOT NULL, "name" character varying(20) NOT NULL, "branch_from" character varying(28) NOT NULL, "branch_to" character varying(28) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "project_id" uuid NOT NULL, CONSTRAINT "PK_36c8def164b2ba14edd3aa9e367" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL, "firstname" character varying(30) NOT NULL, "lastname" character varying(30) NOT NULL, "email" character varying(50) NOT NULL, "password" character varying(75) NOT NULL, "access_token" character varying(128), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_bd55b203eb9f92b0c8390380010" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "release_configurations" ADD CONSTRAINT "FK_996733eb4d9dd939cc9b51f1cae" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "release_configurations" DROP CONSTRAINT "FK_996733eb4d9dd939cc9b51f1cae"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_bd55b203eb9f92b0c8390380010"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "release_configurations"`);
        await queryRunner.query(`DROP TABLE "projects"`);
    }

}
