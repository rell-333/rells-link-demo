"use client"

import { Modal, Button, Switch, Label } from "@heroui/react"
import { Field, fileToDataUrl } from "@/components/popups/release-form-shared"
import { Icon } from "@iconify/react"
import { DatePicker, DateField, Calendar } from '@heroui/react';
import UploadArtwork from "@/components/functional/uploads/UploadArtwork"
import { useState } from "react"
import { useOverlayState } from "@heroui/react"

interface Props {
    onSuccess: () => void
}

const EMPTY_FORM = {
    title: "",
    artist: "",
    identifier: "",
    linkName: "",
    releaseDate: "",
    spotifyLink: "",
    appleLink: "",
    soundcloudLink: "",
    youtubeLink: "",
    isPublic: false,
}

export default function AddReleasePopup({ onSuccess }: Props) {
    const [artworkFile, setArtworkFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [uploadKey, setUploadKey] = useState(0)
    const state = useOverlayState({ defaultOpen: false })
    const [form, setForm] = useState(EMPTY_FORM)

    function handleChange(field: string, value: string | boolean) {
        setForm(prev => ({ ...prev, [field]: value }))
        setErrors(prev => ({ ...prev, [field]: "" }))
    }

    function validate() {
        const newErrors: Record<string, string> = {}
        if (!form.title) newErrors.title = "Title is required"
        if (!form.artist) newErrors.artist = "Artist is required"
        if (!form.identifier) newErrors.identifier = "Identifier is required"
        if (!form.linkName) newErrors.linkName = "Link name is required"
        if (!form.releaseDate) newErrors.releaseDate = "Release date is required"
        if (!artworkFile) newErrors.artwork = "Artwork is required"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    function resetForm() {
        setForm(EMPTY_FORM)
        setArtworkFile(null)
        setErrors({})
        setUploadKey(k => k + 1)
    }

    async function handleSubmit() {
        if (!validate()) return
        setLoading(true)
        try {
            const artworkUrl = artworkFile ? await fileToDataUrl(artworkFile) : ""

            const slugifiedLinkName = form.linkName.toLowerCase().replace(/\s+/g, "-")

            const res = await fetch("/api/releases", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    linkName: slugifiedLinkName,
                    artwork: artworkUrl,
                    releaseDate: new Date(form.releaseDate).toISOString(),
                }),
            })

            const data = await res.json()
            if (data.error) {
                setErrors({ identifier: data.error })
                return
            }

            onSuccess()
            resetForm()
            state.close()
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal>
            <Button variant="secondary" onClick={state.open}>
                <Icon icon="lucide:plus" />
                Add Release
            </Button>
            <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
                <Modal.Container placement="auto" size="cover">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <Modal.Header className="pt-12 pl-6">
                            <Modal.Heading className="text-4xl font-bold">Add Release</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body className="pt-0 px-6 pb-6">
                            <div className="grid grid-cols-[500px_1fr] gap-12 place-content-center h-full">
                                <div className="flex flex-col gap-2">
                                    <Label>Artwork</Label>
                                    <UploadArtwork
                                        key={uploadKey}
                                        onFileSelect={(file: File | null) => setArtworkFile(file)}
                                        className="w-full aspect-square"
                                    />
                                    {errors.artwork && <p className="text-xs text-red-500">{errors.artwork}</p>}
                                </div>

                                <div className="flex flex-col gap-4">
                                    <Field name="title" label="Title" placeholder="Song title"
                                           value={form.title} error={errors.title}
                                           onChange={v => handleChange("title", v)} />

                                    <Field name="artist" label="Artist" placeholder="Artist name"
                                           value={form.artist} error={errors.artist}
                                           onChange={v => handleChange("artist", v)} />

                                    <div className="grid grid-cols-3 gap-4">
                                        <Field name="identifier" label="Identifier" placeholder="e.g. B2S001"
                                               value={form.identifier} error={errors.identifier}
                                               onChange={v => handleChange("identifier", v)} />

                                        <Field name="linkName" label="Link Name" placeholder="e.g. My Song"
                                               value={form.linkName} error={errors.linkName}
                                               onChange={v => handleChange("linkName", v)} />

                                        <div className="flex flex-col gap-1">
                                            <DatePicker className="w-full" name="releaseDate"
                                                        onChange={(date) => date && handleChange("releaseDate", date.toString())}>
                                                <Label>Release Date</Label>
                                                <DateField.Group fullWidth>
                                                    <DateField.Input>{(segment) => <DateField.Segment
                                                        segment={segment}/>}</DateField.Input>
                                                    <DateField.Suffix>
                                                        <DatePicker.Trigger>
                                                            <DatePicker.TriggerIndicator/>
                                                        </DatePicker.Trigger>
                                                    </DateField.Suffix>
                                                </DateField.Group>
                                                <DatePicker.Popover style={{width: "280px"}}>
                                                    <div className="w-[280px]">
                                                        <Calendar aria-label="Release date">
                                                            <Calendar.Header>
                                                                <Calendar.YearPickerTrigger>
                                                                    <Calendar.YearPickerTriggerHeading/>
                                                                    <Calendar.YearPickerTriggerIndicator/>
                                                                </Calendar.YearPickerTrigger>
                                                                <Calendar.NavButton slot="previous"/>
                                                                <Calendar.NavButton slot="next"/>
                                                            </Calendar.Header>
                                                            <Calendar.Grid>
                                                                <Calendar.GridHeader>
                                                                    {(day) =>
                                                                        <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                                                                </Calendar.GridHeader>
                                                                <Calendar.GridBody>{(date) => <Calendar.Cell
                                                                    date={date}/>}</Calendar.GridBody>
                                                            </Calendar.Grid>
                                                            <Calendar.YearPickerGrid>
                                                                <Calendar.YearPickerGridBody>
                                                                    {({year}) => <Calendar.YearPickerCell year={year}/>}
                                                                </Calendar.YearPickerGridBody>
                                                            </Calendar.YearPickerGrid>
                                                        </Calendar>
                                                    </div>
                                                </DatePicker.Popover>
                                            </DatePicker>
                                            {errors.releaseDate &&
                                                <p className="text-xs text-red-500">{errors.releaseDate}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Field name="spotifyLink" label="Spotify Link" placeholder="https://open.spotify.com/..."
                                               value={form.spotifyLink} error={errors.spotifyLink}
                                               onChange={v => handleChange("spotifyLink", v)} />

                                        <Field name="appleLink" label="Apple Music Link" placeholder="https://music.apple.com/..."
                                               value={form.appleLink} error={errors.appleLink}
                                               onChange={v => handleChange("appleLink", v)} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Field name="soundcloudLink" label="SoundCloud Link" placeholder="https://soundcloud.com/..."
                                               value={form.soundcloudLink} error={errors.soundcloudLink}
                                               onChange={v => handleChange("soundcloudLink", v)} />

                                        <Field name="youtubeLink" label="YouTube Link" placeholder="https://youtube.com/..."
                                               value={form.youtubeLink} error={errors.youtubeLink}
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
                                                    <Switch.Control
                                                        className={isSelected ? "bg-green-500/80" : "bg-red-500/80"}>
                                                        <Switch.Thumb>
                                                            <Switch.Icon>
                                                                {isSelected ? (
                                                                    <Icon icon="lucide:unlock"
                                                                          className="size-3 text-inherit opacity-100"/>
                                                                ) : (
                                                                    <Icon icon="lucide:lock"
                                                                          className="size-3 text-inherit opacity-70"/>
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
                                {loading ? "Creating..." : "Create Release"}
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}