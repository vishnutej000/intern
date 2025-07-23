# Supabase Database Setup Guide

## 🚀 Quick Setup Steps

### 1. Get Your Supabase Anon Key
1. Go to your Supabase project: https://supabase.com/dashboard/project/tfvmzwiwwqpsuhffymnk
2. Navigate to **Settings** → **API**
3. Copy the **anon public** key
4. Replace the placeholder in `frontend/.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

### 2. Run the Database Schema
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the entire content from `database/schema.sql`
4. Click **Run** to create tables and sample data

### 3. Verify Setup
Your database should now have:
- ✅ `incidents` table with sample data
- ✅ `cameras` table with 3 cameras
- ✅ Proper indexes and triggers
- ✅ Row Level Security enabled

## 📊 Database Schema

### Incidents Table
```sql
CREATE TABLE incidents (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  camera_location VARCHAR(100) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  thumbnail_url TEXT,
  status VARCHAR(20) DEFAULT 'unresolved',
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  metadata JSONB DEFAULT '{}'
);
```

### Cameras Table
```sql
CREATE TABLE cameras (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  location VARCHAR(100) NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 Features Implemented

### Frontend Integration
- ✅ **Real-time incident loading** from Supabase
- ✅ **Optimistic UI** for resolve button
- ✅ **Error handling** with fallback data
- ✅ **Automatic timestamp formatting**
- ✅ **Dynamic incident counters**

### Database Features
- ✅ **Auto-resolve timestamps** via triggers
- ✅ **Row Level Security** for data protection
- ✅ **Indexes** for performance
- ✅ **JSONB metadata** for flexible data
- ✅ **Real-time subscriptions** ready

## 🎯 API Endpoints Available

Your app automatically gets these endpoints:
- `GET /rest/v1/incidents` - Get all incidents
- `POST /rest/v1/incidents` - Create new incident
- `PATCH /rest/v1/incidents?id=eq.{id}` - Update incident
- `GET /rest/v1/cameras` - Get all cameras

## 🔄 Real-time Features (Ready to Enable)

```typescript
// Subscribe to incident changes
const subscription = DatabaseService.subscribeToIncidents((payload) => {
  console.log('Incident updated:', payload)
  // Refresh incident list
})

// Unsubscribe when component unmounts
DatabaseService.unsubscribeFromIncidents(subscription)
```

## 🛠️ Troubleshooting

### If incidents don't load:
1. Check browser console for errors
2. Verify your anon key in `.env.local`
3. Ensure database schema was run successfully
4. Check Supabase project is active

### If resolve button doesn't work:
1. Check RLS policies are enabled
2. Verify the `set_resolved_timestamp` trigger exists
3. Check network tab for API errors

## 🚀 Next Steps

1. **Replace the anon key** in `.env.local`
2. **Run the database schema** in Supabase SQL Editor
3. **Restart your Next.js dev server**
4. **Test the resolve functionality**

Your incident monitoring system is now connected to a production-ready PostgreSQL database with real-time capabilities!