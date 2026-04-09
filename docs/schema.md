# Database Schema Documentation

## Supabase Tables

### profiles
- id: uuid (primary key, references auth.users)
- rol: text (cliente, peluquero, jefe)
- email: text
- created_at: timestamp
- updated_at: timestamp

### citas
- id: uuid (primary key)
- user_id: uuid (references auth.users)
- servicio: text (Corte, Color, Tratamiento)
- fecha: date
- hora: time
- estado: text (pendiente, confirmada, cancelada)
- created_at: timestamp

### sugerencias
- id: uuid (primary key)
- usuario_id: uuid (references auth.users)
- mensaje: text
- created_at: timestamp

## Row Level Security (RLS) Policies

### profiles
- Users can read/update their own profile
- Jefe can read all profiles

### citas
- Users can read/create/update their own appointments
- Peluquero/Jefe can read/update all appointments

### sugerencias
- Users can create their own suggestions
- Jefe can read all suggestions

## Migrations
- Initial setup via Supabase dashboard
- No SQL migrations needed for this project