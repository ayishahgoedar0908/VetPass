USE vetpass;

INSERT INTO users (name, email, password, role) VALUES
  ('VetPass Demo User', 'demo@vetpass.local', '$2b$10$Wbd5sqnCUuoatVdxPA5w8e9uASdaQkwijb9Hv8mCPxWXqQTntrbHK', 'user');

INSERT INTO pets (user_id, name, species, breed, gender, birth_date, microchip_number, notes) VALUES
  (1, 'Milo', 'Dog', 'Labrador Retriever', 'male', '2021-04-12', 'MC-VE-0001', 'Friendly demo pet');

INSERT INTO vaccinations (pet_id, vaccine_name, veterinarian, administered_at, next_due_at, batch_number, notes) VALUES
  (1, 'Rabies', 'Dr. Janssen', '2025-06-01', '2026-06-01', 'RB-2025-06', 'Annual vaccination');

INSERT INTO medical_records (pet_id, title, record_type, description, record_date, attachment_url) VALUES
  (1, 'Annual Checkup', 'consultation', 'General health check with no issues detected.', '2025-06-01', NULL);