import { Migration } from '@mikro-orm/migrations';

export class Migration20250605061753 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "permission" drop constraint if exists "permission_path_unique";`);
    this.addSql(`create table if not exists "permission" ("id" text not null, "path" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "permission_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_permission_path_unique" ON "permission" (path) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_permission_deleted_at" ON "permission" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "permission" cascade;`);
  }

}
