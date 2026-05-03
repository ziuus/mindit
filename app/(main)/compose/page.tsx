'use client';

import { useSearchParams } from 'next/navigation';
import PostComposer from '@/components/post/PostComposer';
import { Suspense } from 'react';

function ComposeContent() {
  const params = useSearchParams();
  const prompt = params.get('prompt') || undefined;
  return <PostComposer fullPage={true} initialPrompt={prompt} />;
}

export default function ComposePage() {
  return (
    <Suspense fallback={<PostComposer fullPage={true} />}>
      <ComposeContent />
    </Suspense>
  );
}
