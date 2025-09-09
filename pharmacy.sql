-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum-like check constraints
CREATE TABLE auth_user (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE,
  google_id text UNIQUE,
  password_hash text,
  role text NOT NULL CHECK (role IN ('user','admin','doctor')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_email_presence CHECK (
    (role='user' AND (google_id IS NOT NULL)) OR
    (role IN ('admin','doctor') AND (email IS NOT NULL AND password_hash IS NOT NULL))
  )
);

CREATE INDEX idx_auth_user_role ON auth_user(role);
CREATE INDEX idx_auth_user_email ON auth_user(email);

CREATE TABLE user_profile (
  user_id uuid PRIMARY KEY REFERENCES auth_user(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  gender text,
  dob date
);

CREATE TABLE doctor_profile (
  doctor_id uuid PRIMARY KEY REFERENCES auth_user(id) ON DELETE CASCADE,
  full_name text,
  speciality text,
  qualifications text,
  fee decimal(12,2) NOT NULL DEFAULT 0,
  bio text,
  is_verified boolean NOT NULL DEFAULT false,
  availability jsonb NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE user_address (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
  line1 text NOT NULL,
  line2 text,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL DEFAULT 'IN',
  is_default boolean NOT NULL DEFAULT false
);
CREATE INDEX idx_user_address_user ON user_address(user_id);

CREATE TABLE medicine (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku text UNIQUE,
  name text NOT NULL,
  brand text,
  description text,
  dosage_form text,
  strength text,
  pack_size text,
  price decimal(12,2) NOT NULL,
  mrp decimal(12,2),
  prescription_required boolean NOT NULL DEFAULT false,
  category text,
  gst_rate decimal(5,2) NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_medicine_text ON medicine USING GIN (to_tsvector('simple', name || ' ' || coalesce(brand,'') || ' ' || coalesce(description,'')));
CREATE INDEX idx_medicine_category ON medicine(category);

CREATE TABLE medicine_image (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  medicine_id uuid NOT NULL REFERENCES medicine(id) ON DELETE CASCADE,
  url text NOT NULL,
  position int NOT NULL DEFAULT 0
);
CREATE INDEX idx_medicine_image_med ON medicine_image(medicine_id);

CREATE TABLE inventory_batch (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  medicine_id uuid NOT NULL REFERENCES medicine(id) ON DELETE CASCADE,
  supplier text,
  batch_number text,
  expiry_date date,
  quantity_on_hand int NOT NULL DEFAULT 0,
  quantity_reserved int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_inventory_med ON inventory_batch(medicine_id);
CREATE INDEX idx_inventory_expiry ON inventory_batch(expiry_date);

CREATE TABLE cart (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX uq_cart_user ON cart(user_id);

CREATE TABLE cart_item (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id uuid NOT NULL REFERENCES cart(id) ON DELETE CASCADE,
  medicine_id uuid NOT NULL REFERENCES medicine(id),
  qty int NOT NULL CHECK (qty > 0),
  unit_price decimal(12,2) NOT NULL
);
CREATE UNIQUE INDEX uq_cart_item ON cart_item(cart_id, medicine_id);

CREATE TABLE "order" (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_no text UNIQUE NOT NULL,
  user_id uuid NOT NULL REFERENCES auth_user(id),
  shipping_address_id uuid REFERENCES user_address(id),
  subtotal decimal(12,2) NOT NULL,
  tax_total decimal(12,2) NOT NULL DEFAULT 0,
  grand_total decimal(12,2) NOT NULL,
  payment_status text NOT NULL CHECK (payment_status IN ('pending','paid','failed','refunded')) DEFAULT 'pending',
  order_status text NOT NULL CHECK (order_status IN ('placed','processing','dispatched','delivered','cancelled')) DEFAULT 'placed',
  placed_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_order_user ON "order"(user_id);
CREATE INDEX idx_order_status ON "order"(order_status);

CREATE TABLE order_item (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid NOT NULL REFERENCES "order"(id) ON DELETE CASCADE,
  medicine_id uuid NOT NULL REFERENCES medicine(id),
  qty int NOT NULL CHECK (qty > 0),
  unit_price decimal(12,2) NOT NULL,
  line_total decimal(12,2) GENERATED ALWAYS AS (qty * unit_price) STORED
);
CREATE INDEX idx_order_item_order ON order_item(order_id);

CREATE TABLE transaction (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES "order"(id) ON DELETE CASCADE,
  appointment_id uuid,
  provider text NOT NULL DEFAULT 'razorpay',
  provider_payment_id text,
  provider_order_id text,
  amount decimal(12,2) NOT NULL,
  status text NOT NULL CHECK (status IN ('created','authorized','captured','failed','refunded')),
  raw_payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
-- Optional FK for appointment after table creation.

CREATE TABLE prescription (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth_user(id),
  file_url text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending','approved','rejected','expired')) DEFAULT 'pending',
  notes text,
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  verified_at timestamptz,
  verified_by uuid REFERENCES auth_user(id),
  valid_till date
);
CREATE INDEX idx_prescription_user ON prescription(user_id);
CREATE INDEX idx_prescription_status ON prescription(status);

CREATE TABLE prescription_item_rule (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  prescription_id uuid NOT NULL REFERENCES prescription(id) ON DELETE CASCADE,
  medicine_id uuid NOT NULL REFERENCES medicine(id),
  max_refills int,
  max_qty_per_order int
);
CREATE UNIQUE INDEX uq_prescription_rule ON prescription_item_rule(prescription_id, medicine_id);

CREATE TABLE prescription_link (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid NOT NULL REFERENCES "order"(id) ON DELETE CASCADE,
  prescription_id uuid NOT NULL REFERENCES prescription(id)
);
CREATE UNIQUE INDEX uq_prescription_link ON prescription_link(order_id, prescription_id);

CREATE TABLE prescription_review (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  prescription_id uuid NOT NULL REFERENCES prescription(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES auth_user(id),
  decision text NOT NULL CHECK (decision IN ('approved','rejected')),
  reason text,
  decided_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE appointment (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth_user(id),
  doctor_id uuid NOT NULL REFERENCES auth_user(id),
  scheduled_at timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('booked','in_progress','completed','cancelled','refunded')) DEFAULT 'booked',
  fee decimal(12,2) NOT NULL,
  prescription_id uuid REFERENCES prescription(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_appointment_doctor_time ON appointment(doctor_id, scheduled_at);
CREATE INDEX idx_appointment_user ON appointment(user_id);

ALTER TABLE transaction
  ADD CONSTRAINT fk_tx_appointment FOREIGN KEY (appointment_id) REFERENCES appointment(id) ON DELETE CASCADE;

CREATE TABLE video_session (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id uuid UNIQUE NOT NULL REFERENCES appointment(id) ON DELETE CASCADE,
  provider text NOT NULL,
  channel_id text NOT NULL,
  token_user text,
  token_doctor text,
  valid_from timestamptz,
  valid_till timestamptz
);

CREATE TABLE message_log (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth_user(id),
  channel text NOT NULL CHECK (channel IN ('email','whatsapp')),
  template_key text,
  to_address text NOT NULL,
  status text NOT NULL CHECK (status IN ('queued','sent','failed')) DEFAULT 'queued',
  meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_log (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id uuid REFERENCES auth_user(id),
  actor_role text,
  entity_type text NOT NULL,
  entity_id uuid,
  action text NOT NULL,
  diff jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
