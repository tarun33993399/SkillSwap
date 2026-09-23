import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Check, ChevronDown, Clock3, Loader2, PlusCircle, Star } from 'lucide-react';

import type { Gig, PricingTier } from '@/types';
import { CATEGORIES } from '@/data/seed';
import { formatPrice } from '@/lib/utils';

export interface GigFormValues {
  title: string;
  categoryId: string;
  price: string;
  description: string;
  deliveryDays: string;
  packages: PackageDraft[];
}

export interface PackageDraft {
  tier: PricingTier;
  enabled: boolean;
  title: string;
  price: string;
  deliveryDays: string;
  description: string;
  revisions: string;
  features: string;
}

interface GigFormProps {
  mode: 'create' | 'edit';
  initialGig?: Gig;
  creatorName: string;
  onSubmit: (values: GigFormValues) => Promise<void>;
}

interface FormErrors {
  title?: string;
  categoryId?: string;
  price?: string;
  description?: string;
  deliveryDays?: string;
  packages?: string;
}

const tierLabels: Record<PricingTier, string> = {
  basic: 'Basic',
  standard: 'Standard',
  premium: 'Premium',
};

function packageDraftFromGig(gig?: Gig): PackageDraft[] {
  return (['basic', 'standard', 'premium'] as PricingTier[]).map((tier, index) => {
    const existing = gig?.packages.find((item) => item.tier === tier);
    const isBasic = index === 0;
    return {
      tier,
      enabled: Boolean(existing) || isBasic,
      title: existing?.title || `${tierLabels[tier]} Package`,
      price: existing ? String(existing.price) : isBasic ? '' : '',
      deliveryDays: existing ? String(existing.deliveryDays) : gig ? '' : isBasic ? '7' : '',
      description: existing?.description || '',
      revisions: existing ? String(existing.revisions) : '2',
      features: existing?.features.join(', ') || '',
    };
  });
}

function initialValues(gig?: Gig): GigFormValues {
  const basic = gig?.packages.find((item) => item.tier === 'basic');
  return {
    title: gig?.title || '',
    categoryId: gig?.categoryId || '',
    price: basic ? String(basic.price) : '',
    description: gig?.description || '',
    deliveryDays: basic ? String(basic.deliveryDays) : '7',
    packages: packageDraftFromGig(gig),
  };
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
      <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-charcoal)' }}>
        {label}{required && <span aria-hidden="true" style={{ color: 'var(--color-accent-hover)', marginLeft: '0.25rem' }}>*</span>}
      </label>
      {children}
      {error && <span role="alert" style={{ fontSize: '0.8125rem', color: 'var(--color-accent-hover)' }}>{error}</span>}
    </div>
  );
}

function Preview({ values, creatorName }: { values: GigFormValues; creatorName: string }) {
  const category = CATEGORIES.find((item) => item.id === values.categoryId);
  const enabledPackages = values.packages.filter((item) => item.enabled && item.price);
  const previewPrice = Number(values.price) || 0;

  return (
    <aside style={{ position: 'sticky', top: '2rem', alignSelf: 'start' }} aria-label="Live gig preview">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <span style={{ color: 'var(--color-accent-hover)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Live preview</span>
          <h2 style={{ fontFamily: 'var(--font-family-display)', color: 'var(--color-charcoal)', fontSize: '1.25rem', marginTop: '0.25rem' }}>Your service card</h2>
        </div>
        <span style={{ color: 'var(--color-ink-muted)', fontSize: '0.8125rem' }}>Updates as you type</span>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ height: '150px', background: 'linear-gradient(135deg, var(--color-accent-light), var(--color-cream-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent-hover)' }}>
          <PlusCircle size={42} strokeWidth={1.5} />
        </div>
        <div style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent-hover)', display: 'grid', placeItems: 'center', fontSize: '0.7rem', fontWeight: 800 }}>{creatorName.slice(0, 2).toUpperCase()}</div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-ink-soft)' }}>{creatorName}</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.05rem', lineHeight: 1.35, color: 'var(--color-charcoal)', minHeight: '2.85rem', marginBottom: '0.55rem' }}>{values.title || 'Your service title'}</h3>
          <p style={{ color: 'var(--color-ink-soft)', fontSize: '0.875rem', lineHeight: 1.55, minHeight: '4.1rem', marginBottom: '1rem' }}>{values.description || 'Your service description will appear here.'}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
            <span className="tag">{category?.name || 'Category'}</span>
            <span className="tag"><Clock3 size={12} /> {values.deliveryDays || '—'} days</span>
          </div>
          <div className="divider" style={{ marginBottom: '1rem' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ color: 'var(--color-ink-muted)', fontSize: '0.8125rem' }}>Starting at</span>
            <strong style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.2rem', color: 'var(--color-charcoal)' }}>{formatPrice(previewPrice)}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-ink-muted)', fontSize: '0.75rem', marginTop: '0.55rem' }}><Star size={13} fill="var(--color-accent)" color="var(--color-accent)" /> New service</div>
          {enabledPackages.length > 0 && (
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {enabledPackages.map((item) => <div key={item.tier} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-ink-soft)' }}><span>{tierLabels[item.tier]}</span><strong>{formatPrice(Number(item.price) || 0)}</strong></div>)}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default function GigForm({ mode, initialGig, creatorName, onSubmit }: GigFormProps) {
  const [values, setValues] = useState(() => initialValues(initialGig));
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = <K extends keyof GigFormValues>(field: K, value: GigFormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const updatePackage = (index: number, patch: Partial<PackageDraft>) => {
    setValues((current) => ({ ...current, packages: current.packages.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) }));
    setErrors((current) => ({ ...current, packages: undefined }));
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (values.title.trim().length < 5 || values.title.trim().length > 100) next.title = 'Please enter a clear service title.';
    if (!values.categoryId) next.categoryId = 'Please select a category.';
    if (!values.price.trim() || !Number.isFinite(Number(values.price)) || Number(values.price) <= 0) next.price = 'Please enter a valid price.';
    if (values.description.trim().length < 20) next.description = 'Please describe your service clearly.';
    if (!values.deliveryDays.trim() || !Number.isInteger(Number(values.deliveryDays)) || Number(values.deliveryDays) <= 0) next.deliveryDays = 'Please enter a valid delivery time.';
    const invalidPackage = values.packages.some((item) => item.enabled && (!item.title.trim() || !Number.isFinite(Number(item.price)) || Number(item.price) <= 0 || !Number.isInteger(Number(item.deliveryDays)) || Number(item.deliveryDays) <= 0));
    if (invalidPackage) next.packages = 'Complete the enabled package details or turn the package off.';
    return next;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = (error?: string) => ({ borderColor: error ? 'var(--color-accent-hover)' : undefined });

  return (
    <div className="gig-form-layout">
      <form className="gig-form" onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Field label="Service Title" required error={errors.title}>
          <input className="input" aria-label="Service Title" placeholder="e.g. Premium YouTube Thumbnail Design" value={values.title} maxLength={100} onChange={(event) => update('title', event.target.value)} style={inputStyle(errors.title)} />
          <span style={{ color: 'var(--color-ink-muted)', fontSize: '0.75rem', textAlign: 'right' }}>{values.title.length}/100</span>
        </Field>

        <Field label="Category" required error={errors.categoryId}>
          <select className="input" aria-label="Category" value={values.categoryId} onChange={(event) => update('categoryId', event.target.value)} style={inputStyle(errors.categoryId)}>
            <option value="">Select a category</option>
            {CATEGORIES.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </Field>

        <div className="gig-form-two-column">
          <Field label="Starting Price" required error={errors.price}>
            <div style={{ position: 'relative' }}><span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: 'var(--color-ink-soft)' }}>₹</span><input className="input" aria-label="Starting Price" type="number" min="1" step="1" placeholder="e.g. 2500" value={values.price} onChange={(event) => { update('price', event.target.value); updatePackage(0, { price: event.target.value }); }} style={{ ...inputStyle(errors.price), paddingLeft: '2.25rem' }} /></div>
          </Field>
          <Field label="Delivery Time" required error={errors.deliveryDays}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}><input className="input" aria-label="Delivery Time" type="number" min="1" step="1" placeholder="7" value={values.deliveryDays} onChange={(event) => { update('deliveryDays', event.target.value); updatePackage(0, { deliveryDays: event.target.value }); }} style={inputStyle(errors.deliveryDays)} /><span style={{ color: 'var(--color-ink-soft)', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>days</span></div>
          </Field>
        </div>

        <Field label="Description" required error={errors.description}>
          <textarea className="input" aria-label="Description" rows={7} placeholder="Describe what you offer, what clients receive, and what makes your service valuable..." value={values.description} onChange={(event) => update('description', event.target.value)} style={{ ...inputStyle(errors.description), resize: 'vertical', minHeight: '150px' }} />
          <span style={{ color: 'var(--color-ink-muted)', fontSize: '0.75rem' }}>{values.description.length} characters</span>
        </Field>

        <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }} aria-labelledby="packages-heading">
          <div style={{ marginBottom: '1rem' }}><h2 id="packages-heading" style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.2rem', color: 'var(--color-charcoal)' }}>Packages</h2><p style={{ color: 'var(--color-ink-soft)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Offer clear options while keeping your Basic package as the starting price.</p></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {values.packages.map((item, index) => <details className="gig-package" key={item.tier} open={item.enabled} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)', backgroundColor: 'var(--color-surface)' }}>
              <summary style={{ cursor: 'pointer', listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.125rem', fontWeight: 700, color: 'var(--color-charcoal)' }}><span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}><input type="checkbox" aria-label={`Enable ${tierLabels[item.tier]} package`} checked={item.enabled} disabled={index === 0} onChange={(event) => { event.preventDefault(); updatePackage(index, { enabled: event.target.checked }); }} onClick={(event) => event.stopPropagation()} />{tierLabels[item.tier]} package</span><ChevronDown size={17} /></summary>
              {item.enabled && <div style={{ padding: '0 1.125rem 1.125rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="gig-form-two-column"><Field label="Package Title"><input className="input" aria-label={`${tierLabels[item.tier]} package title`} value={item.title} onChange={(event) => updatePackage(index, { title: event.target.value })} /></Field><Field label="Package Price"><div style={{ position: 'relative' }}><span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: 'var(--color-ink-soft)' }}>₹</span><input className="input" aria-label={`${tierLabels[item.tier]} package price`} type="number" min="1" value={item.price} onChange={(event) => { updatePackage(index, { price: event.target.value }); if (index === 0) update('price', event.target.value); }} style={{ paddingLeft: '2.25rem' }} /></div></Field></div>
                <div className="gig-form-two-column"><Field label="Delivery Days"><input className="input" aria-label={`${tierLabels[item.tier]} delivery days`} type="number" min="1" value={item.deliveryDays} onChange={(event) => { updatePackage(index, { deliveryDays: event.target.value }); if (index === 0) update('deliveryDays', event.target.value); }} /></Field><Field label="Revisions"><input className="input" aria-label={`${tierLabels[item.tier]} revisions`} type="number" min="0" value={item.revisions} onChange={(event) => updatePackage(index, { revisions: event.target.value })} /></Field></div>
                <Field label="What is included"><input className="input" aria-label={`${tierLabels[item.tier]} features`} placeholder="e.g. Source file, 2 concepts, commercial use" value={item.features} onChange={(event) => updatePackage(index, { features: event.target.value })} /></Field>
              </div>}
            </details>)}
          </div>
          {errors.packages && <span role="alert" style={{ display: 'block', color: 'var(--color-accent-hover)', fontSize: '0.8125rem', marginTop: '0.5rem' }}>{errors.packages}</span>}
        </section>

        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ minWidth: '180px', justifyContent: 'center', opacity: isSubmitting ? 0.7 : 1 }}>{isSubmitting ? <><Loader2 size={18} className="spin" /> Saving...</> : <><Check size={18} /> {mode === 'create' ? 'Publish Gig' : 'Save Changes'}</>}</button>
          <span style={{ color: 'var(--color-ink-muted)', fontSize: '0.8125rem' }}>Fields marked with * are required.</span>
        </div>
      </form>
      <Preview values={values} creatorName={creatorName} />
    </div>
  );
}