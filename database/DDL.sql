-- Main table
CREATE TABLE IF NOT EXISTS "LLMArticle" (
    id SERIAL PRIMARY KEY,
    location_key VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(256),
    perex VARCHAR(256),
    description VARCHAR(2560),
    modified_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enum type for revision type
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'RevType') THEN
        CREATE TYPE "RevType" AS ENUM ('insert', 'update', 'delete');
    END IF;
END $$;

-- Audit table
CREATE TABLE IF NOT EXISTS "LLMArticlesAudit" (
    rev_id SERIAL PRIMARY KEY,
    article_id INT NOT NULL, -- not referencing, so we can delete the article and watch history of it without any problems
    location_key VARCHAR(255),
    title VARCHAR(256),
    perex VARCHAR(512),
    description VARCHAR(2560),
    modified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    rev_type "RevType" NOT NULL,
    audit_timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Insert trigger for audit
CREATE OR REPLACE FUNCTION "Trigger_LLMArticle_Insert"()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO "LLMArticlesAudit" (
        article_id,
        location_key,
        title,
        perex,
        description,
        modified_at,
        created_at,
        rev_type
    )
    VALUES (
        NEW.id,
        NEW.location_key,
        NEW.title,
        NEW.perex,
        NEW.description,
        NEW.modified_at,
        NEW.created_at,
        'insert'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists before creating
DROP TRIGGER IF EXISTS "After_LLMArticle_Insert" ON "LLMArticle";
CREATE TRIGGER "After_LLMArticle_Insert"
    AFTER INSERT ON "LLMArticle"
    FOR EACH ROW EXECUTE FUNCTION "Trigger_LLMArticle_Insert"();

-- Update trigger for audit
CREATE OR REPLACE FUNCTION "Trigger_LLMArticle_Update"()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO "LLMArticlesAudit" (
        article_id,
        location_key,
        title,
        perex,
        description,
        modified_at,
        created_at,
        rev_type
    )
    VALUES (
        NEW.id,
        NEW.location_key,
        NEW.title,
        NEW.perex,
        NEW.description,
        NEW.modified_at,
        NEW.created_at,
        'update'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists before creating
DROP TRIGGER IF EXISTS "After_LLMArticle_Update" ON "LLMArticle";
CREATE TRIGGER "After_LLMArticle_Update"
    AFTER UPDATE ON "LLMArticle"
    FOR EACH ROW EXECUTE FUNCTION "Trigger_LLMArticle_Update"();