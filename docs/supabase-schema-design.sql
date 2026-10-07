-- =====================================================================
-- CODIA Cafeterías - Diseño de Esquema de Base de Datos Supabase (PostgreSQL)
-- Versión: 1.0.0 (Beta)
-- Descripción: Tablas, Relaciones, RLS y Funciones Transaccionales (RPC)
-- =====================================================================

-- 1. TIPOS Y ENUMS
-- =====================================================================
CREATE TYPE user_role AS ENUM ('superadmin', 'administrador', 'encargado', 'empleado', 'cliente');
CREATE TYPE inventory_movement_type AS ENUM (
  'entrada', 'compra', 'consumo_venta', 'merma', 
  'ajuste_positivo', 'ajuste_negativo', 'devolucion', 'cancelacion'
);
CREATE TYPE loyalty_movement_type AS ENUM (
  'sello_ganado', 'bonificacion', 'ajuste', 'canje', 'vencimiento', 'reversion'
);
CREATE TYPE audit_action_type AS ENUM (
  'descuento', 'merma', 'ajuste_inventario', 'cambio_rol', 
  'cancelacion', 'canje_recompensa', 'configuracion', 'modificacion_empleado'
);
CREATE TYPE payment_method_type AS ENUM ('efectivo', 'tarjeta');
CREATE TYPE attendance_status_type AS ENUM ('puntual', 'retardo', 'ausente', 'justificado');
CREATE TYPE customer_tier_type AS ENUM ('Nuevo', 'Frecuente', 'VIP Consentido');

-- 2. TABLAS BASE
-- =====================================================================

-- Sucursales
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(30) NOT NULL,
  is_main BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Perfiles de usuario vinculados a Supabase Auth (auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'empleado',
  employee_code VARCHAR(20),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Configuración del sistema
CREATE TABLE system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE UNIQUE,
  cafeteria_name VARCHAR(100) NOT NULL DEFAULT 'CODIA Cafetería',
  late_tolerance_minutes INT NOT NULL DEFAULT 15,
  stamps_per_reward INT NOT NULL DEFAULT 8,
  currency VARCHAR(10) NOT NULL DEFAULT 'MXN',
  tax_rate NUMERIC(4, 2) NOT NULL DEFAULT 0.16,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Categorías de Menú
CREATE TABLE categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true
);

-- Insumos de Inventario
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(50) NOT NULL,
  unit VARCHAR(20) NOT NULL, -- 'g', 'ml', 'pza', 'kg', 'lt'
  current_stock NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
  min_stock NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (min_stock >= 0),
  cost_per_unit NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (cost_per_unit >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Productos del Menú
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  code VARCHAR(30) NOT NULL,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL REFERENCES categories(id),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (branch_id, code)
);

-- Recetas
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE UNIQUE,
  estimated_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insumos de la Receta
CREATE TABLE recipe_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
  quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
  UNIQUE (recipe_id, ingredient_id)
);

-- Clientes (Cliente Consentido)
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  code VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  qr_code VARCHAR(50) NOT NULL UNIQUE,
  stamps INT NOT NULL DEFAULT 1 CHECK (stamps >= 0),
  stamps_goal INT NOT NULL DEFAULT 8 CHECK (stamps_goal > 0),
  rewards_available INT NOT NULL DEFAULT 0 CHECK (rewards_available >= 0),
  total_visits INT NOT NULL DEFAULT 1 CHECK (total_visits >= 0),
  total_spent NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total_spent >= 0),
  tier customer_tier_type NOT NULL DEFAULT 'Nuevo',
  last_visit DATE NOT NULL DEFAULT CURRENT_DATE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Promociones
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  code VARCHAR(30) NOT NULL,
  title VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  audience VARCHAR(30) NOT NULL DEFAULT 'todos',
  discount_percentage NUMERIC(5, 2),
  bonus_stamps INT,
  valid_until DATE NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (branch_id, code)
);

-- Secuencia de Folios Consecutivos para Ventas (Garantiza atomicidad concurrente)
CREATE SEQUENCE IF NOT EXISTS sale_folio_seq START WITH 1050;

-- Ventas (POS)
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  folio VARCHAR(30) NOT NULL UNIQUE,
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  payment_method payment_method_type NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  cashier_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  stamps_earned INT NOT NULL DEFAULT 0,
  promotions_applied JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_shift_summary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Detalle de Venta
CREATE TABLE sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_name VARCHAR(150) NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  quantity INT NOT NULL CHECK (quantity > 0),
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0)
);

-- Movimientos de Inventario
CREATE TABLE inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
  type inventory_movement_type NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
  unit VARCHAR(20) NOT NULL,
  reason TEXT NOT NULL,
  cost_impact NUMERIC(10, 2),
  sale_folio VARCHAR(30),
  responsible_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Libro Mayor de Movimientos de Fidelidad
CREATE TABLE loyalty_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  type loyalty_movement_type NOT NULL,
  stamps_delta INT NOT NULL,
  rewards_delta INT NOT NULL DEFAULT 0,
  previous_stamps INT NOT NULL,
  new_stamps INT NOT NULL,
  previous_rewards INT NOT NULL,
  new_rewards INT NOT NULL,
  reason TEXT NOT NULL,
  sale_folio VARCHAR(30),
  responsible_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bitácora de Auditoría (Inmutable - Solo Lectura para Usuarios)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  action audit_action_type NOT NULL,
  description TEXT NOT NULL,
  responsible_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  responsible_role user_role NOT NULL,
  target_entity VARCHAR(50),
  target_id VARCHAR(100),
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Empleados
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  role VARCHAR(50) NOT NULL,
  daily_rate NUMERIC(10, 2) NOT NULL CHECK (daily_rate >= 0),
  schedule VARCHAR(50) NOT NULL,
  work_days VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'activo',
  email VARCHAR(150),
  phone VARCHAR(30),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Registros de Asistencia
CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in TIME,
  check_out TIME,
  status attendance_status_type NOT NULL DEFAULT 'puntual',
  notes TEXT,
  device_simulated VARCHAR(100) DEFAULT 'Hikvision DS-K1T804AM',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (employee_id, date)
);

-- Egresos y Gastos
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  folio VARCHAR(30) NOT NULL UNIQUE,
  date DATE NOT NULL,
  supplier VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  tax NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  receipt_url TEXT,
  ocr_scanned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. FUNCIONES TRANSACCIONALES SEGURAS (RPCs)
-- =====================================================================

-- RPC: Registro Atómico de Venta POS con Deducción de Inventario y Lealtad
CREATE OR REPLACE FUNCTION register_pos_sale(
  p_branch_id UUID,
  p_cashier_id UUID,
  p_items JSONB, -- Array de { product_id, quantity, price, name }
  p_payment_method payment_method_type,
  p_customer_id UUID DEFAULT NULL,
  p_subtotal NUMERIC DEFAULT 0,
  p_discount NUMERIC DEFAULT 0,
  p_total NUMERIC DEFAULT 0,
  p_stamps_earned INT DEFAULT 0,
  p_promotions_applied JSONB DEFAULT '[]'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_sale_id UUID;
  v_folio VARCHAR(30);
  v_next_folio INT;
  v_item JSONB;
  v_prod_id UUID;
  v_qty INT;
  v_recipe_rec RECORD;
  v_item_ing RECORD;
  v_curr_stock NUMERIC;
  v_cust_rec RECORD;
  v_prev_stamps INT;
  v_new_stamps INT;
  v_prev_rewards INT;
  v_new_rewards INT;
  v_rewards_to_add INT;
BEGIN
  -- 1. Validar que el carrito no esté vacío
  IF jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'El carrito de venta no puede estar vacío';
  END IF;

  -- 2. Obtener folio consecutivo seguro y atómico
  v_next_folio := nextval('sale_folio_seq');
  v_folio := 'VTA-' || v_next_folio::text;

  -- 3. Crear cabecera de venta
  INSERT INTO sales (
    branch_id, folio, subtotal, discount, total, 
    payment_method, customer_id, cashier_id, stamps_earned, promotions_applied
  ) VALUES (
    p_branch_id, v_folio, p_subtotal, p_discount, p_total,
    p_payment_method, p_customer_id, p_cashier_id, p_stamps_earned, p_promotions_applied
  ) RETURNING id INTO v_sale_id;

  -- 4. Procesar items y descontar insumos bloqueando filas (FOR UPDATE)
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_prod_id := (v_item->>'product_id')::UUID;
    v_qty := (v_item->>'quantity')::INT;

    IF v_qty <= 0 THEN
      RAISE EXCEPTION 'Cantidad inválida para producto %', v_prod_id;
    END IF;

    -- Insertar item de venta
    INSERT INTO sale_items (sale_id, product_id, product_name, unit_price, quantity, subtotal)
    VALUES (
      v_sale_id, v_prod_id, v_item->>'name', 
      (v_item->>'price')::NUMERIC, v_qty, 
      ((v_item->>'price')::NUMERIC * v_qty)
    );

    -- Buscar receta asociada
    SELECT id INTO v_recipe_rec FROM recipes WHERE product_id = v_prod_id;
    IF FOUND THEN
      FOR v_item_ing IN 
        SELECT ri.ingredient_id, ri.quantity, i.name as ing_name, i.unit, i.current_stock, i.cost_per_unit
        FROM recipe_items ri
        JOIN ingredients i ON i.id = ri.ingredient_id
        WHERE ri.recipe_id = v_recipe_rec.id
        FOR UPDATE OF i
      LOOP
        -- Validar stock suficiente
        IF v_item_ing.current_stock < (v_item_ing.quantity * v_qty) THEN
          RAISE EXCEPTION 'Stock insuficiente para insumo: % (Disponible: %, Requerido: %)', 
            v_item_ing.ing_name, v_item_ing.current_stock, (v_item_ing.quantity * v_qty);
        END IF;

        -- Descontar stock
        UPDATE ingredients 
        SET current_stock = current_stock - (v_item_ing.quantity * v_qty), updated_at = now()
        WHERE id = v_item_ing.ingredient_id;

        -- Registrar movimiento de inventario formal
        INSERT INTO inventory_movements (
          branch_id, ingredient_id, type, quantity, unit, reason, cost_impact, sale_folio, responsible_id
        ) VALUES (
          p_branch_id, v_item_ing.ingredient_id, 'consumo_venta', (v_item_ing.quantity * v_qty),
          v_item_ing.unit, 'Venta POS ' || v_folio, 
          ROUND((v_item_ing.quantity * v_qty * v_item_ing.cost_per_unit), 2),
          v_folio, p_cashier_id
        );
      END LOOP;
    END IF;
  END LOOP;

  -- 5. Procesar sellos de cliente si existe
  IF p_customer_id IS NOT NULL AND p_stamps_earned > 0 THEN
    SELECT * INTO v_cust_rec FROM customers WHERE id = p_customer_id FOR UPDATE;
    IF FOUND THEN
      v_prev_stamps := v_cust_rec.stamps;
      v_prev_rewards := v_cust_rec.rewards_available;
      v_new_stamps := v_prev_stamps + p_stamps_earned;
      v_rewards_to_add := 0;

      IF v_new_stamps >= v_cust_rec.stamps_goal THEN
        v_rewards_to_add := FLOOR(v_new_stamps / v_cust_rec.stamps_goal);
        v_new_stamps := v_new_stamps % v_cust_rec.stamps_goal;
      END IF;

      v_new_rewards := v_prev_rewards + v_rewards_to_add;

      UPDATE customers SET
        stamps = v_new_stamps,
        rewards_available = v_new_rewards,
        total_visits = total_visits + 1,
        total_spent = total_spent + p_total,
        last_visit = CURRENT_DATE
      WHERE id = p_customer_id;

      -- Registrar en libro mayor de lealtad
      INSERT INTO loyalty_movements (
        customer_id, type, stamps_delta, rewards_delta, previous_stamps, new_stamps,
        previous_rewards, new_rewards, reason, sale_folio, responsible_id
      ) VALUES (
        p_customer_id, 
        CASE WHEN p_stamps_earned > 1 THEN 'bonificacion'::loyalty_movement_type ELSE 'sello_ganado'::loyalty_movement_type END,
        p_stamps_earned, v_rewards_to_add, v_prev_stamps, v_new_stamps,
        v_prev_rewards, v_new_rewards,
        'Compra en ticket ' || v_folio, v_folio, p_cashier_id
      );
    END IF;
  END IF;

  -- 6. Registrar en auditoría si hubo descuento
  IF p_discount > 0 THEN
    INSERT INTO audit_logs (
      branch_id, action, description, responsible_id, responsible_role, target_entity, target_id, details
    ) VALUES (
      p_branch_id, 'descuento', 'Descuento de $' || p_discount::text || ' MXN en venta ' || v_folio,
      p_cashier_id, 'empleado', 'venta', v_folio, 
      jsonb_build_object('discount', p_discount, 'subtotal', p_subtotal, 'total', p_total, 'promotions', p_promotions_applied)
    );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'sale_id', v_sale_id,
    'folio', v_folio,
    'total', p_total
  );
END;
$$;

-- 4. POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
-- =====================================================================
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Helper Function para extraer el rol del usuario autenticado
CREATE OR REPLACE FUNCTION get_auth_role() RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- RLS: Audit Logs (Solo lectura para admin y superadmin, prohibido para empleado y cliente)
CREATE POLICY "Admin y Superadmin pueden consultar auditoria"
  ON audit_logs FOR SELECT
  USING (get_auth_role() IN ('superadmin', 'administrador'));

CREATE POLICY "Inserciones en auditoria solo por funciones del sistema"
  ON audit_logs FOR INSERT
  WITH CHECK (true);

-- RLS: Inventario
CREATE POLICY "Todos los empleados de la sucursal pueden ver inventario"
  ON ingredients FOR SELECT
  USING (true);

CREATE POLICY "Solo admin y encargado pueden actualizar inventario"
  ON ingredients FOR UPDATE
  USING (get_auth_role() IN ('superadmin', 'administrador', 'encargado'));

-- RLS: Ventas
CREATE POLICY "Empleados pueden ver ventas de su sucursal"
  ON sales FOR SELECT
  USING (get_auth_role() IN ('superadmin', 'administrador', 'encargado', 'empleado'));

CREATE POLICY "Empleados autorizados pueden registrar ventas"
  ON sales FOR INSERT
  WITH CHECK (get_auth_role() IN ('superadmin', 'administrador', 'encargado', 'empleado'));

-- RLS: Clientes
CREATE POLICY "Clientes solo ven su propio registro"
  ON customers FOR SELECT
  USING (
    get_auth_role() IN ('superadmin', 'administrador', 'encargado', 'empleado') 
    OR id = (SELECT customer_id FROM profiles WHERE id = auth.uid())
  );
