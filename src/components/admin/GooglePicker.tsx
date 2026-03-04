'use client';

import { useEffect, useCallback, useRef } from 'react';

interface GooglePickerProps {
    accessToken: string;
    onPhotosSelected: (files: PickerFile[]) => void;
    children: React.ReactNode;
}

export interface PickerFile {
    id: string;
    name: string;
    mimeType: string;
    thumbnailLink?: string;
    webContentLink?: string;
}

declare global {
    interface Window {
        gapi: any;
        google: any;
    }
}

export default function GooglePicker({ accessToken, onPhotosSelected, children }: GooglePickerProps) {
    const pickerLoaded = useRef(false);

    useEffect(() => {
        // Load the GAPI script only once
        if (document.getElementById('google-picker-script')) {
            pickerLoaded.current = true;
            return;
        }
        const script = document.createElement('script');
        script.id = 'google-picker-script';
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
            window.gapi.load('picker', () => {
                pickerLoaded.current = true;
            });
        };
        document.body.appendChild(script);
    }, []);

    const openPicker = useCallback(() => {
        if (!pickerLoaded.current || !window.google?.picker) {
            // Try to load and open again in a moment
            setTimeout(() => {
                if (window.gapi && !pickerLoaded.current) {
                    window.gapi.load('picker', () => {
                        pickerLoaded.current = true;
                        openPicker();
                    });
                } else {
                    alert('Google Picker is still loading, please wait a moment and try again.');
                }
            }, 1000);
            return;
        }

        if (!accessToken) {
            alert('Please connect your Google account first.');
            return;
        }

        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';
        const appId = process.env.NEXT_PUBLIC_GOOGLE_APP_ID || '';

        // Use a simple DocsView filtered to images - most compatible approach
        const docsView = new window.google.picker.DocsView()
            .setIncludeFolders(false)
            .setMimeTypes('image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif');

        // Try to also include Google Photos view
        let builder = new window.google.picker.PickerBuilder()
            .addView(docsView)
            .setOAuthToken(accessToken)
            .setCallback((data: any) => {
                if (data.action === window.google.picker.Action.PICKED) {
                    const files: PickerFile[] = data.docs.map((doc: any) => ({
                        id: doc.id,
                        name: doc.name || doc.title || `photo_${doc.id}`,
                        mimeType: doc.mimeType || 'image/jpeg',
                        thumbnailLink: doc.thumbnailLink || doc.iconUrl,
                        webContentLink: doc.url,
                    }));
                    onPhotosSelected(files);
                }
            })
            .setTitle('Select Photos from Google Drive');

        // Only add developer key and appId if they are set
        if (apiKey) builder = builder.setDeveloperKey(apiKey);
        if (appId) builder = builder.setAppId(appId);

        // Enable multi-select
        builder = builder.enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED);

        const picker = builder.build();
        picker.setVisible(true);
    }, [accessToken, onPhotosSelected]);

    return (
        <div onClick={openPicker} style={{ cursor: 'pointer', display: 'inline-flex' }}>
            {children}
        </div>
    );
}
