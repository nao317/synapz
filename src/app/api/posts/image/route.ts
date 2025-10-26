import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file found' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${randomUUID()}-${file.name}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('posts')
    .upload(filename, buffer, {
      contentType: file.type,
    });

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    return NextResponse.json({ success: false, error: 'Failed to upload image' }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage
    .from('posts')
    .getPublicUrl(filename);

  if (!publicUrlData) {
    return NextResponse.json({ success: false, error: 'Failed to get public URL' }, { status: 500 });
  }

  return NextResponse.json({ success: true, url: publicUrlData.publicUrl });
}
