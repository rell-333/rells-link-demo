"use client"

import { TextField, Input, Label } from "@heroui/react"

// bits shared between AddReleasePopup and EditReleasePopup

export function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

interface FieldProps {
    name: string
    label: string
    placeholder: string
    value: string
    error?: string
    onChange: (value: string) => void
}

export function Field({ name, label, placeholder, value, error, onChange }: FieldProps) {
    return (
        <div className="flex flex-col gap-1">
            <TextField name={name} variant="secondary">
                <Label>{label}</Label>
                <Input placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
            </TextField>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    )
}