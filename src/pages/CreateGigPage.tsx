import { useNavigate } from 'react-router-dom';

import { GigsAPI } from '@/lib/api';
import { useAuthStore, useGigStore, useUIStore, useNotificationStore } from '@/store';
import { CATEGORIES } from '@/data/seed';
import { slugify } from '@/lib/utils';
import EmptyState from '@/components/ui/EmptyState';
import GigForm, { type GigFormValues } from '@/components/gigs/GigForm';

function buildPackages(values: GigFormValues) {
  return values.packages.filter((item) => item.enabled).map((item) => ({
    tier: item.tier,
    title: item.title.trim(),
    description: item.description.trim() || `${item.title.trim()} service package`,
    price: Number(item.price),
    deliveryDays: Number(item.deliveryDays),
    revisions: Number(item.revisions) || 0,
    features: item.features.split(',').map((feature) => feature.trim()).filter(Boolean),
  }));
}

export default function CreateGigPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const addGig = useGigStore((state) => state.addGig);
  const addToast = useUIStore((state) => state.addToast);
  const addNotification = useNotificationStore((state) => state.add);

  if (!currentUser || currentUser.role === 'buyer') {
    return <div className="container-xl section-pad"><EmptyState title="Creators only" message="This page is for sellers. Browse our marketplace to discover talented creators." actionLabel="Explore Gigs" onAction={() => navigate('/discover')} /></div>;
  }

  const handleSubmit = async (values: GigFormValues) => {
    const now = new Date().toISOString();
    const category = CATEGORIES.find((item) => item.id === values.categoryId);
    const result = GigsAPI.create({
      sellerId: currentUser.id,
      categoryId: values.categoryId,
      title: values.title.trim(),
      slug: slugify(values.title),
      description: values.description.trim(),
      shortDescription: values.description.trim().slice(0, 120),
      tags: [category?.slug || 'general'],
      images: ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80'],
      packages: buildPackages(values),
      avgRating: 0,
      reviewCount: 0,
      orderCount: 0,
      isFeatured: false,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });

    if (!result.ok) {
      addToast({ type: 'error', title: 'Unable to publish service.', message: result.error.message });
      return;
    }

    addGig(result.data);
    addNotification({ userId: currentUser.id, type: 'gig_published', title: 'Service published', message: `${result.data.title} is now live.`, relatedId: result.data.id });
    addToast({ type: 'success', title: 'Your service has been published.' });
    navigate(`/gig/${result.data.id}`);
  };

  return (
    <div className="container-xl section-pad">
      <div style={{ marginBottom: '2.5rem', maxWidth: '720px' }}>
        <h1 style={{ fontFamily: 'var(--font-family-display)', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--color-charcoal)', marginBottom: '0.5rem' }}>Create a New Service</h1>
        <p style={{ color: 'var(--color-ink-soft)', fontSize: '1rem', lineHeight: 1.6 }}>Showcase your expertise and make it easy for clients to book you.</p>
      </div>
      <GigForm mode="create" creatorName={currentUser.name} onSubmit={handleSubmit} />
    </div>
  );
}