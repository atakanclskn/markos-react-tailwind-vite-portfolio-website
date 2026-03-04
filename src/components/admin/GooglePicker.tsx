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
    const gapiLoaded = useRef(false);
    const pickerApiLoaded = useRef(false);

    const openPicker = useCallback(() => {
        if (!gapiLoaded.current || !pickerApiLoaded.current) {
            alert('Google Picker is still loading, please try again in a moment.');
            return;
        }

        if (!accessToken) {
            alert('Please connect your Google account first.');
            return;
        }

        const view = new window.google.picker.DocsView(window.google.picker.ViewId.PHOTOS)
            .setIncludeFolders(true)
            .setMimeTypes('image/jpeg,image/png,image/webp,image/heif');

        const picker = new window.google.picker.PickerBuilder()
            .addView(view)
            .addView(new window.google.picker.DocsView(window.google.picker.ViewId.PHOTO_ALBUMS))
            .setOAuthToken(accessToken)
            .setAppId(process.env.NEXT_PUBLIC_GOOGLE_APP_ID || '')
            .setDeveloperKey(process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '')
            .setCallback((data: any) => {
                if (data.action === window.google.picker.Action.PICKED) {
                    const files: PickerFile[] = data.docs.map((doc: any) => ({
                        id: doc.id,
                        name: doc.name,
                        mimeType: doc.mimeType,
                        thumbnailLink: doc.thumbnailLink || doc.iconUrl,
                        webContentLink: doc.url,
                    }));
                    onPhotosSelected(files);
                }
            })
            .setTitle('Select Photos from Google Photos')
            .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
            .build();

        picker.setVisible(true);
    }, [accessToken, onPhotosSelected]);

    useEffect(() => {
        // Load the Google API platform library
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
            window.gapi.load('picker', () => {
                pickerApiLoaded.current = true;
                gapiLoaded.current = true;
            });
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div onClick={openPicker} style={{ cursor: 'pointer', display: 'inline-flex' }}>
            {children}
        </div>
    );
}
