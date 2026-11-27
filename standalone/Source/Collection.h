#pragma once

// The Mac's collection: recordings and pictures that came from the phone
// export (prd.md, Phone export) or from files added by hand. Kept in
// ~/Library/Application Support/Pipp/collection: collection.json lists them,
// recordings/<id>.<ext> with <id>.png thumbnails and pictures/<id>.<ext> hold
// the files, the same layout as the export. Message thread only.

#include <juce_audio_formats/juce_audio_formats.h>
#include <juce_graphics/juce_graphics.h>

#include <functional>
#include <vector>

namespace pipp::ui
{
struct CollRecording
{
    juce::String id, bird, latin, date, mime, audio, thumb, from; // audio, thumb: paths in the folder
    int type = 0;            // 0 song, 1 call, 2 alarm, 3 flight
    int seconds = 0;
    float confidence = -1.0f; // -1: no match (a file added by hand)
};

struct CollPicture
{
    juce::String id, bird, date, mime, image, from;
};

class Collection
{
public:
    struct ImportResult
    {
        int recordings = 0, pictures = 0, known = 0, broken = 0;
        juce::String errorKey; // coll.err_* when nothing was imported
    };
    struct AddResult
    {
        int added = 0, skipped = 0;
    };

    // knownBird: whether an id is one of Pipp's birds.
    Collection(const juce::File& folder, std::function<bool(const juce::String&)> knownBird);

    const juce::File& folder() const noexcept { return dir; }
    const std::vector<CollRecording>& recordings() const noexcept { return recs; }
    const std::vector<CollPicture>& pictures() const noexcept { return pics; }
    juce::File file(const juce::String& relative) const { return relative.isEmpty() ? juce::File() : dir.getChildFile(relative); }

    void load();
    ImportResult importExport(const juce::File& zip);
    AddResult addFiles(const juce::Array<juce::File>& files, const juce::String& bird);
    // Writes a stored zip of the given items, the same format as the phone's.
    bool exportTo(const juce::File& zip, const std::vector<CollRecording>& r, const std::vector<CollPicture>& p) const;
    void removeRecording(const juce::String& id);
    void removePicture(const juce::String& id);

    juce::AudioFormatManager& formats() noexcept { return formatManager; }

    static juce::String audioExt(const juce::String& mime);
    static juce::String imageExt(const juce::String& mime);
    static juce::String now();

private:
    void save() const;
    void sort();
    juce::String freeName(const juce::String& sub, const juce::String& id, const juce::String& ext) const;
    // A 120x40 sonogram of the first 30 s, 0 to 8 kHz, ink on face, as the phone draws.
    juce::Image thumbnail(juce::AudioFormatReader& reader) const;

    juce::File dir;
    std::function<bool(const juce::String&)> known;
    std::vector<CollRecording> recs;
    std::vector<CollPicture> pics;
    juce::AudioFormatManager formatManager;
};
} // namespace pipp::ui
