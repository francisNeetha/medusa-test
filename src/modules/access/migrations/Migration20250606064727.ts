import { Migration } from '@mikro-orm/migrations';

export class Migration20250606064727 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "user" drop constraint if exists "user_email_unique";`);
    this.addSql(`create table if not exists "user" ("id" text not null, "first_name" text null, "last_name" text null, "email" text not null, "avatar_url" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "user_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_user_deleted_at" ON "user" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_user_email_unique" ON "user" (email) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "user_role" ("id" text not null, "role_id" text not null, "user_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "user_role_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_user_role_role_id" ON "user_role" (role_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_user_role_user_id" ON "user_role" (user_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_user_role_deleted_at" ON "user_role" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "user_role" add constraint "user_role_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade;`);
    this.addSql(`alter table if exists "user_role" add constraint "user_role_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "user_role" drop constraint if exists "user_role_user_id_foreign";`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "user_role" cascade;`);
  }

}
