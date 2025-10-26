import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file found' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log('Original file name:', file.name);
    const fileExtension = file.name.split('.').pop();
    const filename = `${randomUUID()}.${fileExtension}`;
    console.log('Generated filename for upload:', filename);
    
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
  } catch (error) {
    console.error('POST /api/posts/image error', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

