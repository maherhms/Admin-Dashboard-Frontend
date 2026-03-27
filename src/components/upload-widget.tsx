import React, {useEffect, useRef, useState} from 'react'
import {UploadWidgetValue} from "@/types";
import {UploadCloudIcon} from "lucide-react";
import {CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET} from "@/constants";

type UploadWidgetProps = {
      value?: UploadWidgetValue | null;
      onChange?: (value: UploadWidgetValue | null) => void;
      disabled?: boolean;
    };

function UploadWidget({ value = null, onChange, disabled = false }: UploadWidgetProps) {
    const widgetRef = useRef<CloudinaryWidget | null>(null);
    const onChangeRef = useRef(onChange);

    const [preview, setPreview] = useState<UploadWidgetValue | null>(value);
    const [deleteToken, setDeleteToken] = useState<string | null>(null);
    const [isRemoving, setIsRemoving] = useState(false);

    useEffect(() => {
        setPreview(value);
        if(!value) setDeleteToken(null);
    }, [value]);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        if(typeof window === 'undefined') return;

        const initialWidget = () => {
            if(!window.cloudinary || widgetRef.current) return false;

            widgetRef.current = window.cloudinary.createUploadWidget({
                cloudName: CLOUDINARY_CLOUD_NAME,
                uploadPreset: CLOUDINARY_UPLOAD_PRESET,
                multiple: false,
                folder: 'uploads',
                maxFileSize: 5000000,
                allowedFormats: ['png', 'jpg', 'jpeg' , 'webp'],
            }, (error, result) => {
                if(!error && result.event === 'success') {
                    const payload : UploadWidgetValue = {
                        url : result.info.secure_url,
                        publicId : result.info.public_id,
                    }

                    setPreview(payload);
                    setDeleteToken(result.info.delete_token ?? null);
                    onChangeRef.current?.(payload);
                }
            });
            return true;
        }
        if(initialWidget()) return;

        const intervalId = setInterval(() => {
            if(initialWidget()) {
                window.clearInterval(intervalId);
            }
        }, 500)

        return () => clearInterval(intervalId);
    }, []);

    const openWidget = () => {
        if(!disabled) widgetRef.current?.open();
    };

    const removeFromCloudinary = async () => {
        if(!deleteToken) return;
        setIsRemoving(true);
        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/delete_by_token`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ token: deleteToken }),
                }
            );
            if (!response.ok) throw new Error('Failed to delete Cloudinary asset');
            setPreview(null);
            setDeleteToken(null);
            onChangeRef.current?.(null);
        } catch (error) {
            console.error('Cloudinary delete_by_token failed', error);
        } finally {
            setIsRemoving(false);
        }
    }

    return (
        <div className="space-y-2">
            {preview ? (
                <div className="upload-preview">
                    <img src={preview.url} alt="Uploaded file" className="w-full h-auto rounded-md object-cover"/>
                    <div className="upload-actions">
                        <button type="button" onClick={openWidget} className="upload-action">Change</button>
                        {deleteToken && (
                            <button type="button" onClick={removeFromCloudinary} className="upload-action">Remove</button>
                        )}
                    </div>
                </div>

            ):
                <div className="upload-dropzone" role="button" aria-disabled={disabled} tabIndex={disabled ? -1 : 0}
                     onClick={openWidget}
                     onKeyDown={(event) => {
                         if(disabled) return;
                         if(event.key === 'Enter' || event.key === ' ') {
                             event.preventDefault();
                             openWidget();
                         }
                     }}
                >
                    <div className="upload-prompt">
                        <UploadCloudIcon className="icon"/>
                        <div>
                            <p>Click to upload photo</p>
                            <p>PNG, JPG up to 5 MB</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default UploadWidget
