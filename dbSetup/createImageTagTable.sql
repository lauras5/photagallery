CREATE TABLE IF NOT EXISTS image_tag (
    image_id VARCHAR(12),
    tag_id VARCHAR(64),
    PRIMARY KEY(image_id, tag_id),
    FOREIGN KEY (image_id) REFERENCES image(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
);
