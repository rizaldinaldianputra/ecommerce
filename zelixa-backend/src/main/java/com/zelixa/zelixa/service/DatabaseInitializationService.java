package com.zelixa.zelixa.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DatabaseInitializationService implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        log.info("Starting database schema synchronization...");
        try {
            // Add missing columns to product table
            jdbcTemplate.execute(
                    "ALTER TABLE product ADD COLUMN IF NOT EXISTS is_top_product BOOLEAN DEFAULT FALSE NOT NULL");
            jdbcTemplate.execute(
                    "ALTER TABLE product ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN DEFAULT FALSE NOT NULL");
            jdbcTemplate.execute(
                    "ALTER TABLE product ADD COLUMN IF NOT EXISTS is_recommended BOOLEAN DEFAULT FALSE NOT NULL");
            jdbcTemplate.execute("ALTER TABLE product ADD COLUMN IF NOT EXISTS brand_id BIGINT");

            // Create brand table
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS brand (" +
                    "id BIGSERIAL PRIMARY KEY, " +
                    "name VARCHAR(255) NOT NULL, " +
                    "slug VARCHAR(255) UNIQUE, " +
                    "logo_url VARCHAR(500), " +
                    "description TEXT, " +
                    "is_active BOOLEAN DEFAULT TRUE NOT NULL, " +
                    "created_at TIMESTAMP WITHOUT TIME ZONE, " +
                    "updated_at TIMESTAMP WITHOUT TIME ZONE" +
                    ")");

            // Create reviews table
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS reviews (" +
                    "id BIGSERIAL PRIMARY KEY, " +
                    "product_id BIGINT NOT NULL, " +
                    "user_id BIGINT NOT NULL, " +
                    "user_name VARCHAR(100), " +
                    "rating INTEGER NOT NULL, " +
                    "comment TEXT, " +
                    "is_active BOOLEAN DEFAULT FALSE NOT NULL, " +
                    "created_at TIMESTAMP WITHOUT TIME ZONE, " +
                    "updated_at TIMESTAMP WITHOUT TIME ZONE" +
                    ")");

            log.info("Database schema synchronization completed successfully.");
        } catch (Exception e) {
            log.error("Failed to synchronize database schema: {}", e.getMessage());
            // We don't throw here to allow the app to try starting anyway,
            // but the error will be visible in logs.
        }
    }
}
