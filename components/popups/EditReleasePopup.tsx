"use client"

import { Modal, Button, Switch } from "@heroui/react"
import { Icon } from "@iconify/react"
import { Label, useOverlayState } from '@heroui/react'
import { useState } from "react"
import { Field } from "@/components/popups/release-form-shared"

interface Release {
    id: string
    title: string
    artist: string
    artwork: string
    views: number
    identifier: string
    linkName: string | null
    releaseDate: string
    spotifyLink: string | null
    appleLink: string | null
    soundcloudLink: string | null
    youtubeLink: string | null
    isPublic: boolean
}

interface Props {
    release: Release
    onSuccess: () => void
    onClose: () => void
}

export default function EditReleasePopup({ release, onSuccess, onClose }: Props) {
    // mounted on demand by ReleasesPage, so it opens immediately and
    // reports closes upward so the page can clear its editTarget
    const state = useOverlayState({
        defaultOpen: true,
        onOpenChange: (open) => { if (!open) onClose() },
    })
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        title: release.title,
        artist: release.artist,
        identifier: release.identifier,
        linkName: release.linkName || "",
        spotifyLink: release.spotifyLink || "",
        appleLink: release.appleLink || "",
        soundcloudLink: release.soundcloudLink || "",
        youtubeLink: release.youtubeLink || "",
        isPublic: release.isPublic,
    })

    function handleChange(field: string, value: string | boolean) {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    async function handleSubmit() {
        setLoading(true)
        try {
            await fetch("/api/releases", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: release.id, ...form }),
            })
            onSuccess()
            state.close()
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal>
            <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
                <Modal.Container placement="auto" size="cover">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header className="pt-12 pl-6">
                            <Modal.Heading className="text-4xl font-bold">Edit Release</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body className="pt-0 px-6 pb-6">
                            <div className="grid grid-cols-[500px_1fr] gap-12 place-content-center h-full">
                                <div className="flex flex-col gap-2">
                                    <Label>Artwork</Label>
                                    <div className="w-full aspect-square rounded-2xl overflow-hidden border-2 border-zinc-200">
                                        {release.artwork ? (
                                            <img src={release.artwork} alt={release.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-50 flex items-center justify-center">
                                                <Icon icon="lucide:image" className="text-zinc-300 text-4xl" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <Field name="title" label="Title" placeholder="Song title"
                                           value={form.title}
                                           onChange={v => handleChange("title", v)} />

                                    <Field name="artist" label="Artist" placeholder="Artist name"
                                           value={form.artist}
                                           onChange={v => handleChange("artist", v)} />

                                    <div className="grid grid-cols-2 gap-4">
                                        <Field name="identifier" label="Identifier" placeholder="e.g. B2S001"
                                               value={form.identifier}
                                               onChange={v => handleChange("identifier", v)} />

                                        <Field name="linkName" label="Link Name" placeholder="e.g. My Song"
                                               value={form.linkName}
                                               onChange={v => handleChange("linkName", v)} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Field name="spotifyLink" label="Spotify Link" placeholder="https://open.spotify.com/..."
                                               value={form.spotifyLink}
                                               onChange={v => handleChange("spotifyLink", v)} />

                                        <Field name="appleLink" label="Apple Music Link" placeholder="https://music.apple.com/..."
                                               value={form.appleLink}
                                               onChange={v => handleChange("appleLink", v)} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Field name="soundcloudLink" label="SoundCloud Link" placeholder="https://soundcloud.com/..."
                                               value={form.soundcloudLink}
                                               onChange={v => handleChange("soundcloudLink", v)} />

                                        <Field name="youtubeLink" label="YouTube Link" placeholder="https://youtube.com/..."
                                               value={form.youtubeLink}
                                               onChange={v => handleChange("youtubeLink", v)} />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label>Visibility</Label>
                                        <Switch
                                            name="isPublic"
                                            size="lg"
                                            isSelected={form.isPublic}
                                            onChange={(isSelected) => handleChange("isPublic", isSelected)}
                                            aria-label="Visibility"
                                        >
                                            {({isSelected}) => (
                                                <Switch.Content>
                                                    <Switch.Control className={isSelected ? "bg-green-500/80" : "bg-red-500/80"}>
                                                        <Switch.Thumb>
                                                            <Switch.Icon>
                                                                {isSelected ? (
                                                                    <Icon icon="lucide:unlock" className="size-3 text-inherit opacity-100"/>
                                                                ) : (
                                                                    <Icon icon="lucide:lock" className="size-3 text-inherit opacity-70"/>
                                                                )}
                                                            </Switch.Icon>
                                                        </Switch.Thumb>
                                                    </Switch.Control>
                                                </Switch.Content>
                                            )}
                                        </Switch>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={handleSubmit} isDisabled={loading}>
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}