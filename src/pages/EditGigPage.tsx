import { Link, useNavigate, useParams } from 'react-router-dom';

import { GigsAPI } from '@/lib/api';
import { useAuthStore, useGigStore, useUIStore } from '@/store';
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

export default function EditGigPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const gigs = useGigStore((state) => state.gigs);
  const updateGig = useGigStore((state) => state.updateGig);
  const addToast = useUIStore((state) => state.addToast);
  if (gigs.length === 0) return <div className="container-xl section-pad"><div style={{ minHeight: '360px' }} /></div>;

  const gig = gigs.find((item) => item.id === id);
  if (!gig) {
    return <div className="container-xl section-pad"><EmptyState title="Service Not Found" message="This service could not be found or may have been removed." actionLabel="Back to Dashboard" onAction={() => navigate('/dashboard')} /></div>;
  }

  if (!currentUser || gig.sellerId !== currentUser.id) {
    return <div className="container-xl section-pad"><EmptyState title="You don't have permission to edit this service." message="Only the creator who published this service can update it." actionLabel="Back to Dashboard" onAction={() => navigate('/dashboard')} /></div>;
  }

  const handleSubmit = async (values: GigFormValues) => {
    const category = CATEGORIES.find((item) => item.id === values.categoryId);
    const result = GigsAPI.update(gig.id, {
      categoryId: values.categoryId,
      title: values.title.trim(),
      slug: slugify(values.title),
      description: values.description.trim(),
      shortDescription: values.description.trim().slice(0, 120),
      tags: [category?.slug || 'general'],
      packages: buildPackages(values),
    });

    if (!result.ok) {
      addToast({ type: 'error', title: 'Unable to update service.', message: result.error.message });
      return;
    }

    updateGig(result.data);
    addToast({ type: 'success', title: 'Your service has been updated.' });
    navigate(`/gig/${gig.id}`);
  };

  return (
    <div className="container-xl section-pad">
      <div style={{ marginBottom: '2.5rem', maxWidth: '720px' }}>
        <h1 style={{ fontFamily: 'var(--font-family-display)', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--color-charcoal)', marginBottom: '0.5rem' }}>Edit Your Service</h1>
        <p style={{ color: 'var(--color-ink-soft)', fontSize: '1rem', lineHeight: 1.6 }}>Update your service details and keep your offering current.</p>
      </div>
      <GigForm mode="edit" initialGig={gig} creatorName={currentUser.name} onSubmit={handleSubmit} />
      <Link to="/dashboard" style={{ display: 'inline-block', marginTop: '1.5rem', color: 'var(--color-ink-soft)', fontWeight: 600, textDecoration: 'none' }}>Cancel and return to dashboard</Link>
    </div>
  );
}