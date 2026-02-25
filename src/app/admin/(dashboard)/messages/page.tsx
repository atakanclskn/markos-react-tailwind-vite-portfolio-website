'use client';

import { useEffect, useState } from 'react';
import Topbar from '@/components/admin/Topbar';
import {
    Inbox,
    Star,
    Archive,
    Trash2,
    Copy,
    Check,
    Loader2,
    Mail,
    StarOff,
    ArchiveRestore,
    RefreshCw,
} from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import {
    getMessages,
    markMessageRead,
    toggleMessageStarred,
    toggleMessageArchived,
    deleteMessage as deleteMessageFn,
} from '@/lib/firestore';
import type { ContactMessage } from '@/types';

export default function MessagesPage() {
    const {
        messages,
        setMessages,
        selectedMessageId,
        setSelectedMessageId,
        messageFilter,
        setMessageFilter,
        updateMessage,
        removeMessage,
    } = useAdminStore();

    const [loading, setLoading] = useState(true);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const data = await getMessages();
            setMessages(data);
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Filter messages
    const filteredMessages = messages.filter((m) => {
        if (messageFilter === 'starred') return m.starred && !m.archived;
        if (messageFilter === 'archived') return m.archived;
        return !m.archived; // inbox
    });

    const selectedMessage = messages.find((m) => m.id === selectedMessageId) ?? null;

    const handleSelectMessage = async (msg: ContactMessage) => {
        setSelectedMessageId(msg.id);
        if (!msg.read) {
            try {
                await markMessageRead(msg.id);
                updateMessage(msg.id, { read: true });
            } catch (err) {
                console.error('Failed to mark message as read:', err);
            }
        }
    };

    const handleToggleStar = async (msg: ContactMessage) => {
        try {
            await toggleMessageStarred(msg.id, !msg.starred);
            updateMessage(msg.id, { starred: !msg.starred });
        } catch (err) {
            console.error('Failed to toggle star:', err);
        }
    };

    const handleToggleArchive = async (msg: ContactMessage) => {
        try {
            await toggleMessageArchived(msg.id, !msg.archived);
            updateMessage(msg.id, { archived: !msg.archived });
        } catch (err) {
            console.error('Failed to toggle archive:', err);
        }
    };

    const handleDelete = async (msg: ContactMessage) => {
        if (!confirm('Are you sure you want to delete this message?')) return;
        try {
            await deleteMessageFn(msg.id);
            removeMessage(msg.id);
        } catch (err) {
            console.error('Failed to delete message:', err);
        }
    };

    const handleCopy = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const formatDate = (date: Date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const FILTERS = [
        { key: 'inbox' as const, label: 'Inbox', icon: Inbox },
        { key: 'starred' as const, label: 'Starred', icon: Star },
        { key: 'archived' as const, label: 'Archived', icon: Archive },
    ];

    return (
        <>
            <Topbar
                title="Messages"
                actions={
                    <button
                        onClick={fetchMessages}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-lg border border-white/[0.06] px-3.5 py-2
                            text-sm text-[#a0a0a0] transition-colors hover:bg-white/[0.04] hover:text-[#f5f5f5]
                            disabled:opacity-50"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                }
            />

            <div className="flex h-[calc(100vh-64px)]">
                {/* Left Column: Filters */}
                <div className="w-[200px] shrink-0 border-r border-white/[0.06] bg-[#0c0c0c] p-3">
                    <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-[#555]">
                        Filters
                    </p>
                    <div className="space-y-1">
                        {FILTERS.map((f) => (
                            <button
                                key={f.key}
                                onClick={() => setMessageFilter(f.key)}
                                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                                    messageFilter === f.key
                                        ? 'bg-[#c8a96e]/10 text-[#c8a96e]'
                                        : 'text-[#a0a0a0] hover:bg-white/[0.04] hover:text-[#f5f5f5]'
                                }`}
                            >
                                <f.icon className="h-4 w-4" />
                                <span>{f.label}</span>
                                {f.key === 'inbox' && (
                                    <span className="ml-auto text-xs text-[#666]">
                                        {messages.filter((m) => !m.archived && !m.read).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Middle Column: Message List */}
                <div className="w-[340px] shrink-0 overflow-y-auto border-r border-white/[0.06]">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-5 w-5 animate-spin text-[#c8a96e]" />
                        </div>
                    ) : filteredMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-[#666]">
                            <Mail className="mb-3 h-8 w-8 text-[#333]" />
                            <p className="text-sm">No messages</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/[0.04]">
                            {filteredMessages.map((msg) => (
                                <button
                                    key={msg.id}
                                    onClick={() => handleSelectMessage(msg)}
                                    className={`w-full px-4 py-3.5 text-left transition-colors ${
                                        selectedMessageId === msg.id
                                            ? 'bg-white/[0.04]'
                                            : 'hover:bg-white/[0.02]'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <p
                                            className={`text-sm truncate ${
                                                msg.read
                                                    ? 'text-[#a0a0a0] font-normal'
                                                    : 'text-[#f5f5f5] font-semibold'
                                            }`}
                                        >
                                            {msg.name}
                                        </p>
                                        <div className="flex shrink-0 items-center gap-1.5">
                                            {msg.starred && (
                                                <Star className="h-3 w-3 fill-[#c8a96e] text-[#c8a96e]" />
                                            )}
                                            {!msg.read && (
                                                <div className="h-2 w-2 rounded-full bg-[#c8a96e]" />
                                            )}
                                        </div>
                                    </div>
                                    <p
                                        className={`mt-0.5 text-xs truncate ${
                                            msg.read ? 'text-[#666]' : 'text-[#a0a0a0]'
                                        }`}
                                    >
                                        {msg.subject}
                                    </p>
                                    <p className="mt-1 text-[11px] text-[#555]">
                                        {formatDate(msg.createdAt)}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Message Detail */}
                <div className="flex-1 overflow-y-auto">
                    {selectedMessage ? (
                        <div className="p-6 lg:p-8">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-[#f5f5f5]">
                                        {selectedMessage.subject}
                                    </h3>
                                    <p className="mt-1 text-sm text-[#666]">
                                        from {selectedMessage.name}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleToggleStar(selectedMessage)}
                                        className="rounded-lg p-2 text-[#666] transition-colors hover:bg-white/[0.04] hover:text-[#c8a96e]"
                                        title={selectedMessage.starred ? 'Remove star' : 'Add star'}
                                    >
                                        {selectedMessage.starred ? (
                                            <StarOff className="h-4 w-4" />
                                        ) : (
                                            <Star className="h-4 w-4" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleToggleArchive(selectedMessage)}
                                        className="rounded-lg p-2 text-[#666] transition-colors hover:bg-white/[0.04] hover:text-[#a0a0a0]"
                                        title={selectedMessage.archived ? 'Unarchive' : 'Archive'}
                                    >
                                        {selectedMessage.archived ? (
                                            <ArchiveRestore className="h-4 w-4" />
                                        ) : (
                                            <Archive className="h-4 w-4" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(selectedMessage)}
                                        className="rounded-lg p-2 text-[#666] transition-colors hover:bg-red-500/10 hover:text-red-400"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="mt-6 space-y-3 rounded-xl border border-white/[0.06] bg-[#111] p-5">
                                <InfoRow
                                    label="Email"
                                    value={selectedMessage.email}
                                    onCopy={() => handleCopy(selectedMessage.email, 'email')}
                                    copied={copiedField === 'email'}
                                />
                                {selectedMessage.phone && (
                                    <InfoRow
                                        label="Phone"
                                        value={selectedMessage.phone}
                                        onCopy={() => handleCopy(selectedMessage.phone, 'phone')}
                                        copied={copiedField === 'phone'}
                                    />
                                )}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-[#555]">Date</p>
                                        <p className="text-sm text-[#a0a0a0]">
                                            {selectedMessage.createdAt
                                                ? new Date(selectedMessage.createdAt).toLocaleDateString(
                                                      'en-US',
                                                      {
                                                          year: 'numeric',
                                                          month: 'long',
                                                          day: 'numeric',
                                                          hour: '2-digit',
                                                          minute: '2-digit',
                                                      }
                                                  )
                                                : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Message Body */}
                            <div className="mt-6">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#555]">
                                    Message
                                </p>
                                <div className="rounded-xl border border-white/[0.06] bg-[#111] p-5">
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#d0d0d0]">
                                        {selectedMessage.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center text-[#666]">
                            <Mail className="mb-3 h-10 w-10 text-[#333]" />
                            <p className="text-sm">Select a message to read</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

function InfoRow({
    label,
    value,
    onCopy,
    copied,
}: {
    label: string;
    value: string;
    onCopy: () => void;
    copied: boolean;
}) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs text-[#555]">{label}</p>
                <p className="text-sm text-[#a0a0a0]">{value}</p>
            </div>
            <button
                onClick={onCopy}
                className="rounded-md p-1.5 text-[#555] transition-colors hover:bg-white/[0.04] hover:text-[#a0a0a0]"
                title={`Copy ${label.toLowerCase()}`}
            >
                {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                    <Copy className="h-3.5 w-3.5" />
                )}
            </button>
        </div>
    );
}
