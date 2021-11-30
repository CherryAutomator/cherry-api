import {MigrationInterface, QueryRunner} from "typeorm";

export class addCascadeDelete1638299213942 implements MigrationInterface {
    name = 'addCascadeDelete1638299213942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."release_configurations" DROP CONSTRAINT "FK_996733eb4d9dd939cc9b51f1cae"`);
        await queryRunner.query(`ALTER TABLE "public"."release_configurations" ADD CONSTRAINT "FK_996733eb4d9dd939cc9b51f1cae" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."release_configurations" DROP CONSTRAINT "FK_996733eb4d9dd939cc9b51f1cae"`);
        await queryRunner.query(`ALTER TABLE "public"."release_configurations" ADD CONSTRAINT "FK_996733eb4d9dd939cc9b51f1cae" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
