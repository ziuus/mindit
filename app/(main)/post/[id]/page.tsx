import { Metadata } from 'next';
import PostPageClient from './PostPageClient';
import { createClient } from '@/utils/supabase/server';

interface Props {
  params: Promise<{ id: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mindit-gules.vercel.app';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from('posts')
    .select('content, pseudonym, mood, category')
    .eq('id', id)
    .single();

  if (!post) {
    return {
      title: 'Mindit — Say what you can\'t say anywhere else',
    };
  }

  const excerpt = post.content.length > 120
    ? post.content.substring(0, 117) + '...'
    : post.content;

  const ogImageUrl = `${BASE_URL}/api/og?id=${id}`;

  return {
    title: `"${excerpt}" — Mindit`,
    description: `${post.pseudonym} shared this on Mindit. ${post.content.substring(0, 150)}`,
    openGraph: {
      title: `Mindit — Anonymous Mental Health Community`,
      description: `"${excerpt}"`,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      type: 'article',
      url: `${BASE_URL}/post/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `Mindit — "${excerpt}"`,
      description: post.content.substring(0, 200),
      images: [ogImageUrl],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  return <PostPageClient id={id} />;
}
