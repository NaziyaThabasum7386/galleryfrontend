# Database Setup Instructions

This document explains how to set up the Supabase database for the Gallery Management application.

## Prerequisites

- A Supabase project (already configured in `.env`)
- Access to the Supabase SQL Editor

## Setup Steps

### 1. Run the Migration

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to the **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the contents of `supabase/migrations/create_gallery_table.sql`
6. Paste it into the SQL Editor
7. Click **Run** to execute the migration

### 2. Verify the Setup

After running the migration, verify that everything was created successfully:

#### Check the Table
```sql
SELECT * FROM gallery_images;
```

#### Check the Storage Bucket
1. Go to **Storage** in the Supabase Dashboard
2. You should see a bucket named `gallery-images`
3. The bucket should be set to **Public**

#### Check RLS Policies
```sql
SELECT * FROM pg_policies WHERE tablename = 'gallery_images';
```

## What Was Created

### Database Table: `gallery_images`
- **id**: UUID primary key
- **title**: Text (required)
- **category**: Text (required)
- **description**: Text (optional)
- **image_url**: Text (required)
- **created_at**: Timestamp with timezone
- **updated_at**: Timestamp with timezone
- **user_id**: UUID (optional, for future auth integration)

### Storage Bucket: `gallery-images`
- Public bucket for storing gallery images
- Supports public read access
- Authenticated users can upload, update, and delete

### Row Level Security (RLS) Policies
- **SELECT**: Public access (anyone can view)
- **INSERT**: Authenticated users only
- **UPDATE**: Authenticated users only
- **DELETE**: Authenticated users only

### Indexes
- Category index for fast filtering
- Created_at index for sorting by date

### Triggers
- Auto-update `updated_at` timestamp on row updates

## Testing Without Authentication

For development purposes, you can temporarily make the INSERT, UPDATE, and DELETE policies public:

```sql
-- Temporary: Allow anyone to insert (remove after testing)
DROP POLICY IF EXISTS "Authenticated users can insert images" ON gallery_images;
CREATE POLICY "Anyone can insert images"
  ON gallery_images FOR INSERT
  TO public
  WITH CHECK (true);

-- Temporary: Allow anyone to update (remove after testing)
DROP POLICY IF EXISTS "Authenticated users can update images" ON gallery_images;
CREATE POLICY "Anyone can update images"
  ON gallery_images FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Temporary: Allow anyone to delete (remove after testing)
DROP POLICY IF EXISTS "Authenticated users can delete images" ON gallery_images;
CREATE POLICY "Anyone can delete images"
  ON gallery_images FOR DELETE
  TO public
  USING (true);
```

Also update storage policies:

```sql
-- Temporary: Allow anyone to upload to storage
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Anyone can upload images"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'gallery-images');

DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
CREATE POLICY "Anyone can delete images"
  ON storage.objects FOR DELETE
  TO public
  USING (bucket_id = 'gallery-images');
```

**Important**: Remember to restore the authenticated-only policies before deploying to production!

## Troubleshooting

### Error: "permission denied for table gallery_images"
- Make sure RLS policies are correctly set up
- For testing, you can temporarily allow public access (see above)

### Error: "The resource was not found"
- The storage bucket might not exist
- Run the storage bucket creation part of the migration again

### Images not uploading
- Check that the storage bucket is public
- Verify storage policies are correctly configured
- Check browser console for detailed error messages

## Next Steps

After the database is set up:
1. The application will automatically connect using the credentials in `.env`
2. You can start uploading images through the UI
3. All CRUD operations will work through the GalleryService
