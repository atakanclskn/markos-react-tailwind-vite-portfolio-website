'use client';

import { useEffect, useState, useCallback } from 'react';
import Topbar from '@/components/admin/Topbar';
import {
    ChevronDown,
    Save,
    Loader2,
    Upload,
    Plus,
    Trash2,
    X,
} from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import {
    getHeroContent,
    updateHeroContent,
    getFounderInfo,
    updateFounderInfo,
    getContactInfo,
    updateContactInfo,
    getBentoGridSettings,
    updateBentoGridSettings,
} from '@/lib/firestore';
import { uploadFile } from '@/lib/storage';
import type { HeroContent, FounderInfo, ContactInfo, FounderStat, BentoGridSettings } from '@/types';

export default function SectionsPage() {
    const {
        heroContent,
        setHeroContent,
        founderInfo,
        setFounderInfo,
        contactInfo,
        setContactInfo,
        bentoGridSettings,
        setBentoGridSettings,
    } = useAdminStore();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [openSection, setOpenSection] = useState<string | null>('hero');
    const [toast, setToast] = useState<string | null>(null);

    // Local form states
    const [heroForm, setHeroForm] = useState<HeroContent>({ title: '', subtitle: '', buttonText: '' });
    const [founderForm, setFounderForm] = useState<FounderInfo>({
        name: '',
        title: '',
        bio: '',
        photoUrl: '',
        stats: [
            { value: '', label: '' },
            { value: '', label: '' },
            { value: '', label: '' },
        ],
    });
    const [contactForm, setContactForm] = useState<ContactInfo>({
        heading: '',
        description: '',
        email: '',
        phone: '',
        address: '',
        statusText: 'Currently available for new projects',
        statusActive: true,
    });
    const [bentoSettingsForm, setBentoSettingsForm] = useState<BentoGridSettings>({
        imageSwapMinSeconds: 8,
        imageSwapMaxSeconds: 14,
        row1LayoutSwapSeconds: 15,
        row2LayoutSwapSeconds: 12,
    });
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const showToast = useCallback((message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    }, []);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [hero, founder, contact, bento] = await Promise.all([
                    getHeroContent(),
                    getFounderInfo(),
                    getContactInfo(),
                    getBentoGridSettings(),
                ]);
                if (hero) {
                    setHeroContent(hero);
                    setHeroForm(hero);
                }
                if (founder) {
                    setFounderInfo(founder);
                    setFounderForm({
                        ...founder,
                        stats: founder.stats?.length
                            ? founder.stats
                            : [
                                { value: '', label: '' },
                                { value: '', label: '' },
                                { value: '', label: '' },
                            ],
                    });
                    if (founder.photoUrl) setPhotoPreview(founder.photoUrl);
                }
                if (contact) {
                    setContactInfo(contact);
                    setContactForm(contact);
                }
                if (bento) {
                    setBentoGridSettings(bento);
                    setBentoSettingsForm(bento);
                }
            } catch (err) {
                console.error('Failed to fetch section texts:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- Save Handlers ---
    const handleSaveHero = async () => {
        setSaving('hero');
        try {
            await updateHeroContent(heroForm);
            setHeroContent(heroForm);
            showToast('Hero section saved successfully.');
        } catch (err) {
            console.error('Failed to save hero:', err);
        } finally {
            setSaving(null);
        }
    };

    const handleSaveFounder = async () => {
        setSaving('founder');
        try {
            let photoUrl = founderForm.photoUrl;
            if (photoFile) {
                photoUrl = await uploadFile(
                    `founder/profile-${Date.now()}.${photoFile.name.split('.').pop()}`,
                    photoFile
                );
            }
            const data = { ...founderForm, photoUrl };
            await updateFounderInfo(data);
            setFounderInfo(data);
            setPhotoFile(null);
            showToast('Founder section saved successfully.');
        } catch (err) {
            console.error('Failed to save founder:', err);
        } finally {
            setSaving(null);
        }
    };

    const handleSaveContact = async () => {
        setSaving('contact');
        try {
            await updateContactInfo(contactForm);
            setContactInfo(contactForm);
            showToast('Contact section saved successfully.');
        } catch (err) {
            console.error('Failed to save contact:', err);
        } finally {
            setSaving(null);
        }
    };

    const handleSaveBentoGrid = async () => {
        setSaving('bento');
        try {
            await updateBentoGridSettings(bentoSettingsForm);
            setBentoGridSettings(bentoSettingsForm);
            showToast('Portfolio Grid settings saved successfully.');
        } catch (err) {
            console.error('Failed to save bento grid settings:', err);
        } finally {
            setSaving(null);
        }
    };

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const updateStat = (index: number, field: keyof FounderStat, value: string) => {
        const updated = [...founderForm.stats];
        updated[index] = { ...updated[index], [field]: value };
        setFounderForm({ ...founderForm, stats: updated });
    };

    const toggleSection = (key: string) => {
        setOpenSection(openSection === key ? null : key);
    };

    if (loading) {
        return (
            <>
                <Topbar title="Section Texts" />
                <div className="flex items-center justify-center py-32">
                    <Loader2 className="h-6 w-6 animate-spin text-[#c8a96e]" />
                </div>
            </>
        );
    }

    return (
        <>
            <Topbar title="Section Texts" />

            {/* Toast */}
            {toast && (
                <div className="fixed right-6 top-20 z-50 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400 shadow-lg">
                    <span>{toast}</span>
                    <button onClick={() => setToast(null)}>
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}

            <div className="mx-auto max-w-3xl p-6 lg:p-8">
                <div className="space-y-3">
                    {/* Hero Section Accordion */}
                    <AccordionItem
                        title="Hero Section"
                        isOpen={openSection === 'hero'}
                        onToggle={() => toggleSection('hero')}
                    >
                        <div className="space-y-4">
                            <InputField
                                label="Main Title"
                                value={heroForm.title}
                                onChange={(v) => setHeroForm({ ...heroForm, title: v })}
                                placeholder="e.g. Capturing Moments"
                            />
                            <InputField
                                label="Subtitle"
                                value={heroForm.subtitle}
                                onChange={(v) => setHeroForm({ ...heroForm, subtitle: v })}
                                placeholder="e.g. Professional photography services"
                            />
                            <InputField
                                label="Button Text"
                                value={heroForm.buttonText}
                                onChange={(v) => setHeroForm({ ...heroForm, buttonText: v })}
                                placeholder="e.g. View Portfolio"
                            />
                            <SaveButton onClick={handleSaveHero} loading={saving === 'hero'} />
                        </div>
                    </AccordionItem>

                    {/* Founder Section Accordion */}
                    <AccordionItem
                        title="Founder Section"
                        isOpen={openSection === 'founder'}
                        onToggle={() => toggleSection('founder')}
                    >
                        <div className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <InputField
                                    label="Name"
                                    value={founderForm.name}
                                    onChange={(v) => setFounderForm({ ...founderForm, name: v })}
                                    placeholder="e.g. Onur Satici"
                                />
                                <InputField
                                    label="Title / Role"
                                    value={founderForm.title}
                                    onChange={(v) => setFounderForm({ ...founderForm, title: v })}
                                    placeholder="e.g. Founder & Photographer"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm text-[#a0a0a0]">Biography</label>
                                <textarea
                                    value={founderForm.bio}
                                    onChange={(e) => setFounderForm({ ...founderForm, bio: e.target.value })}
                                    rows={4}
                                    placeholder="Write a short biography..."
                                    className="w-full rounded-lg border border-white/[0.06] bg-[#141414] px-4 py-2.5
                                        text-sm text-[#f5f5f5] placeholder-[#444] outline-none resize-none
                                        transition-colors focus:border-[#c8a96e]/40 focus:ring-1 focus:ring-[#c8a96e]/20"
                                />
                            </div>

                            {/* Stats */}
                            <div>
                                <label className="mb-2 block text-sm text-[#a0a0a0]">Statistics</label>
                                <div className="grid gap-3 sm:grid-cols-3">
                                    {founderForm.stats.map((stat, i) => (
                                        <div
                                            key={i}
                                            className="rounded-lg border border-white/[0.06] bg-[#111] p-3"
                                        >
                                            <input
                                                type="text"
                                                value={stat.value}
                                                onChange={(e) =>
                                                    updateStat(i, 'value', e.target.value)
                                                }
                                                placeholder="e.g. 10+"
                                                className="mb-2 w-full rounded-md border border-white/[0.06] bg-[#0a0a0a] px-3 py-1.5
                                                    text-center text-lg font-bold text-[#c8a96e] placeholder-[#333] outline-none
                                                    focus:border-[#c8a96e]/40"
                                            />
                                            <input
                                                type="text"
                                                value={stat.label}
                                                onChange={(e) =>
                                                    updateStat(i, 'label', e.target.value)
                                                }
                                                placeholder="e.g. Years Experience"
                                                className="w-full rounded-md border border-white/[0.06] bg-[#0a0a0a] px-3 py-1.5
                                                    text-center text-xs text-[#a0a0a0] placeholder-[#333] outline-none
                                                    focus:border-[#c8a96e]/40"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Profile Photo */}
                            <div>
                                <label className="mb-2 block text-sm text-[#a0a0a0]">
                                    Profile Photo
                                </label>
                                <div className="flex items-center gap-4">
                                    {photoPreview && (
                                        <img
                                            src={photoPreview}
                                            alt="Preview"
                                            className="h-20 w-20 rounded-xl object-cover border border-white/[0.06]"
                                        />
                                    )}
                                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-white/[0.1] px-4 py-3 text-sm text-[#666] transition-colors hover:border-[#c8a96e]/30 hover:text-[#a0a0a0]">
                                        <Upload className="h-4 w-4" />
                                        <span>{photoPreview ? 'Change Photo' : 'Upload Photo'}</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoSelect}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            <SaveButton onClick={handleSaveFounder} loading={saving === 'founder'} />
                        </div>
                    </AccordionItem>

                    {/* Contact Section Accordion */}
                    <AccordionItem
                        title="Contact Section"
                        isOpen={openSection === 'contact'}
                        onToggle={() => toggleSection('contact')}
                    >
                        <div className="space-y-4">
                            <InputField
                                label="Email"
                                value={contactForm.email}
                                onChange={(v) => setContactForm({ ...contactForm, email: v })}
                                placeholder="hello@markos.studio"
                            />
                            <InputField
                                label="Phone"
                                value={contactForm.phone}
                                onChange={(v) => setContactForm({ ...contactForm, phone: v })}
                                placeholder="+1 (555) 000-0000"
                            />
                            <InputField
                                label="Address"
                                value={contactForm.address}
                                onChange={(v) => setContactForm({ ...contactForm, address: v })}
                                placeholder="Istanbul, Turkey"
                            />

                            {/* Availability Toggle */}
                            <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-[#111] px-4 py-3">
                                <div>
                                    <p className="text-sm text-[#f5f5f5]">Availability Status</p>
                                    <p className="text-xs text-[#666]">
                                        Show availability on contact section
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        setContactForm({
                                            ...contactForm,
                                            statusActive: !contactForm.statusActive,
                                        })
                                    }
                                    className={`relative h-6 w-11 rounded-full transition-colors ${contactForm.statusActive
                                        ? 'bg-[#c8a96e]'
                                        : 'bg-[#333]'
                                        }`}
                                >
                                    <div
                                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${contactForm.statusActive
                                            ? 'translate-x-[22px]'
                                            : 'translate-x-0.5'
                                            }`}
                                    />
                                </button>
                            </div>

                            <SaveButton onClick={handleSaveContact} loading={saving === 'contact'} />
                        </div>
                    </AccordionItem>

                    {/* Bento Grid Settings Accordion */}
                    <AccordionItem
                        title="Portfolio Grid Settings"
                        isOpen={openSection === 'bento'}
                        onToggle={() => toggleSection('bento')}
                    >
                        <div className="space-y-4">
                            <div className="text-sm text-[#a0a0a0] mb-4 border-b border-white/5 pb-4">
                                Adjust the animation intervals (in seconds) for the homepage portfolio grid.
                                Separate the limits to prevent all animations from jumping simultaneously.
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <SliderField
                                    label="Image Swap Interval (Min)"
                                    value={bentoSettingsForm.imageSwapMinSeconds}
                                    min={3}
                                    max={30}
                                    onChange={(v) => setBentoSettingsForm({ ...bentoSettingsForm, imageSwapMinSeconds: v })}
                                />
                                <SliderField
                                    label="Image Swap Interval (Max)"
                                    value={bentoSettingsForm.imageSwapMaxSeconds}
                                    min={5}
                                    max={45}
                                    onChange={(v) => setBentoSettingsForm({ ...bentoSettingsForm, imageSwapMaxSeconds: v })}
                                />
                                <SliderField
                                    label="Top Row Resize Interval"
                                    value={bentoSettingsForm.row1LayoutSwapSeconds}
                                    min={5}
                                    max={60}
                                    onChange={(v) => setBentoSettingsForm({ ...bentoSettingsForm, row1LayoutSwapSeconds: v })}
                                />
                                <SliderField
                                    label="Bottom Row Resize Interval"
                                    value={bentoSettingsForm.row2LayoutSwapSeconds}
                                    min={5}
                                    max={60}
                                    onChange={(v) => setBentoSettingsForm({ ...bentoSettingsForm, row2LayoutSwapSeconds: v })}
                                />
                            </div>

                            <SaveButton onClick={handleSaveBentoGrid} loading={saving === 'bento'} />
                        </div>
                    </AccordionItem>
                </div>
            </div>
        </>
    );
}

// --- Reusable Components ---

function AccordionItem({
    title,
    isOpen,
    onToggle,
    children,
}: {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-[#111] overflow-hidden">
            <button
                onClick={onToggle}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
            >
                <span className="text-sm font-medium text-[#f5f5f5]">{title}</span>
                <ChevronDown
                    className={`h-4 w-4 text-[#666] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>
            {isOpen && (
                <div className="border-t border-white/[0.06] px-5 py-5">{children}</div>
            )}
        </div>
    );
}

function InputField({
    label,
    value,
    onChange,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-sm text-[#a0a0a0]">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-lg border border-white/[0.06] bg-[#141414] px-4 py-2.5
                    text-sm text-[#f5f5f5] placeholder-[#444] outline-none
                    transition-colors focus:border-[#c8a96e]/40 focus:ring-1 focus:ring-[#c8a96e]/20"
            />
        </div>
    );
}

function SliderField({
    label,
    value,
    min,
    max,
    onChange,
}: {
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: (val: number) => void;
}) {
    // Calculate percentage for gradient track
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="rounded-lg border border-white/[0.06] bg-[#141414] p-4">
            <div className="mb-4 flex items-center justify-between">
                <label className="text-sm font-medium text-[#f5f5f5]">{label}</label>
                <div className="flex items-center gap-1.5 rounded-md bg-[#222] px-2.5 py-1">
                    <span className="text-sm font-semibold text-[#c8a96e]">{value}</span>
                    <span className="text-xs text-[#a0a0a0]">sec</span>
                </div>
            </div>

            <div className="relative flex items-center h-6">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="absolute z-20 w-full opacity-0 cursor-pointer h-full"
                />

                {/* Custom Track */}
                <div className="absolute z-10 w-full h-1.5 rounded-full bg-[#333] overflow-hidden pointer-events-none">
                    <div
                        className="h-full bg-[#c8a96e] transition-all duration-150 ease-out"
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {/* Custom Thumb */}
                <div
                    className="absolute z-10 h-4 w-4 rounded-full bg-white shadow-md pointer-events-none transition-all duration-150 ease-out"
                    style={{ left: `calc(${percentage}% - 8px)` }}
                />
            </div>

            <div className="mt-2 flex justify-between px-1">
                <span className="text-[10px] text-[#666] font-medium tracking-wide">{min}s</span>
                <span className="text-[10px] text-[#666] font-medium tracking-wide">{max}s</span>
            </div>
        </div>
    );
}

function SaveButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
    return (
        <div className="flex justify-end pt-2">
            <button
                onClick={onClick}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-[#c8a96e] px-4 py-2
                    text-sm font-medium text-[#0a0a0a] transition-all duration-200
                    hover:bg-[#e0c992] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Save className="h-4 w-4" />
                )}
                <span>Save Changes</span>
            </button>
        </div>
    );
}
