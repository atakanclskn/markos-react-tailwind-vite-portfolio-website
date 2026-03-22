'use client';

import { useEffect, useState, useCallback } from 'react';
import Topbar from '@/components/admin/Topbar';
import { useAdminStore } from '@/store/adminStore';
import { getContactInfo, updateContactInfo, logAuditAction } from '@/lib/firestore';
import type { ContactInfo } from '@/types';
import { useSession } from 'next-auth/react';
import { InputField, SaveButton } from '../components';
import { Loader2, X } from 'lucide-react';
import AdminSplitView from '@/components/admin/AdminSplitView';
import ContactSection from '@/components/ContactSection';
import { useWebHaptics } from 'web-haptics/react';

export default function ContactSectionPage() {
    const { trigger } = useWebHaptics();
    const { contactInfo, setContactInfo, adminEmail } = useAdminStore();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [contactForm, setContactForm] = useState<ContactInfo>({
        heading: '', description: '', email: '', phone: '', address: '', statusText: 'Currently available for new projects', statusActive: true,
    });

    const showToast = useCallback((message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    }, []);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const contact = await getContactInfo();
                if (contact) {
                    setContactInfo(contact);
                    setContactForm(contact);
                }
            } catch (err) {
                console.error('Failed to fetch contact info:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [setContactInfo]);

    const handleSaveContact = async () => {
        setSaving(true);
        try {
            await updateContactInfo(contactForm);
            setContactInfo(contactForm);

            const emailToLog = adminEmail || 'Unknown User';
            await logAuditAction('UPDATE', 'Updated CONTACT Section', 'Changes saved to database.', emailToLog);

            showToast('Contact section saved successfully.');
        } catch (err) {
            console.error('Failed to save contact:', err);
            trigger("error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <>
                <Topbar title="Contact Section" />
                <div className="flex justify-center py-32">
                    <Loader2 className="h-6 w-6 animate-spin text-[#c8a96e]" />
                </div>
            </>
        );
    }

    return (
        <AdminSplitView
            title="Contact Section Editor"
            preview={
                <div className="w-full min-h-full bg-black">
                    <ContactSection previewData={contactForm} />
                </div>
            }
        >
            <div className="p-6 lg:p-8 space-y-6">
                {toast && (
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400 shadow-sm">
                        <span>{toast}</span>
                        <button onClick={() => setToast(null)} className="ml-auto"><X className="h-3.5 w-3.5" /></button>
                    </div>
                )}
                <div className="rounded-xl border border-white/[0.06] bg-[#111] p-6 space-y-4">
                    <InputField label="Email" value={contactForm.email} onChange={(v) => setContactForm({ ...contactForm, email: v })} placeholder="hello@markos.studio" />
                    <InputField label="Phone" value={contactForm.phone} onChange={(v) => setContactForm({ ...contactForm, phone: v })} placeholder="+1 (555) 000-0000" />
                    <InputField label="Address" value={contactForm.address} onChange={(v) => setContactForm({ ...contactForm, address: v })} placeholder="Istanbul, Turkey" />

                    <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-[#111] px-4 py-3">
                        <div>
                            <p className="text-sm text-[#f5f5f5]">Availability Status</p>
                            <p className="text-xs text-[#666]">Show availability on contact section</p>
                        </div>
                        <button
                            onClick={() => setContactForm({ ...contactForm, statusActive: !contactForm.statusActive })}
                            className={`relative h-6 w-11 rounded-full transition-colors ${contactForm.statusActive ? 'bg-[#c8a96e]' : 'bg-[#333]'}`}
                        >
                            <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${contactForm.statusActive ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                        </button>
                    </div>

                    <SaveButton onClick={handleSaveContact} loading={saving} />
                </div>
            </div>
        </AdminSplitView>
    );
}
