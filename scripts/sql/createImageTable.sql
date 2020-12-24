CREATE TABLE IF NOT EXISTS image (
    id VARCHAR(16) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    extension_type VARCHAR(16) NOT NULL,
    width INT NOT NULL,
    height INT NOT NULL
);
