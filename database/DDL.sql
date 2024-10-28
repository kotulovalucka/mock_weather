-- Create custom enum type
CREATE TYPE RevType AS ENUM ('delete', 'insert', 'update');

BEGIN;

-- Create main article table
CREATE TABLE IF NOT EXISTS public."LLMArticle"
(
    id SERIAL NOT NULL,
    location_key character varying(255) COLLATE pg_catalog."default" NOT NULL,
    title character varying(256) COLLATE pg_catalog."default" NOT NULL,
    perex character varying(256) COLLATE pg_catalog."default" NOT NULL,
    description character varying(2560) COLLATE pg_catalog."default" NOT NULL,
    modified_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LLMArticle_pkey" PRIMARY KEY (id),
    CONSTRAINT "LLMArticle_location_key_key" UNIQUE (location_key)
);

-- Create audit table
CREATE TABLE IF NOT EXISTS public."LLMArticleAudit"
(
    rev_id SERIAL NOT NULL,  
    id integer NOT NULL,  
    location_key character varying(255) COLLATE pg_catalog."default" NOT NULL,
    title character varying(256) COLLATE pg_catalog."default" NOT NULL,
    perex character varying(512) COLLATE pg_catalog."default" NOT NULL,
    description character varying(2560) COLLATE pg_catalog."default" NOT NULL,
    modified_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    rev_type RevType NOT NULL,
    rev_timestamp timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LLMArticlesAudit_pkey" PRIMARY KEY (rev_id)
);

END;

-- Insert trigger for audit
CREATE OR REPLACE FUNCTION "Trigger_LLMArticle_Insert"()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO "LLMArticleAudit" (
        id,
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
        'insert'::RevType  
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
    INSERT INTO "LLMArticleAudit" (
        id,
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
        'update'::RevType
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists before creating
DROP TRIGGER IF EXISTS "After_LLMArticle_Update" ON "LLMArticle";
CREATE TRIGGER "After_LLMArticle_Update"
    AFTER UPDATE ON "LLMArticle"
    FOR EACH ROW EXECUTE FUNCTION "Trigger_LLMArticle_Update"();