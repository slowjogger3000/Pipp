#include "Collection.h"

#include <algorithm>
#include <cmath>
#include <complex>

namespace pipp::ui
{
namespace
{
const char* const kTypeIds[4] = { "song", "call", "alarm", "flight" };
const char* const kFormat = "pipp-export";

juce::String str(const juce::var& v) { return v.isString() ? v.toString() : juce::String(); }

double num(const juce::var& v, double fallback)
{
    if (v.isInt() || v.isInt64() || v.isDouble())
    {
        const double d = static_cast<double>(v);
        return std::isfinite(d) ? d : fallback;
    }
    return fallback;
}

int typeIndex(const juce::String& id)
{
    for (int i = 0; i < 4; ++i)
        if (id == kTypeIds[i])
            return i;
    return 0;
}

juce::String stamp(const juce::Time& t) { return t.formatted("%Y-%m-%d %H:%M"); }

// In-place radix-2 FFT.
void fft(std::vector<std::complex<float>>& a)
{
    const std::size_t n = a.size();
    for (std::size_t i = 1, j = 0; i < n; ++i)
    {
        std::size_t bit = n >> 1;
        for (; (j & bit) != 0; bit >>= 1)
            j ^= bit;
        j ^= bit;
        if (i < j)
            std::swap(a[i], a[j]);
    }
    for (std::size_t len = 2; len <= n; len <<= 1)
    {
        const float ang = -2.0f * juce::MathConstants<float>::pi / static_cast<float>(len);
        const std::complex<float> w(std::cos(ang), std::sin(ang));
        for (std::size_t i = 0; i < n; i += len)
        {
            std::complex<float> c(1.0f, 0.0f);
            for (std::size_t k = 0; k < len / 2; ++k)
            {
                const auto u = a[i + k], v = a[i + k + len / 2] * c;
                a[i + k] = u + v;
                a[i + k + len / 2] = u - v;
                c *= w;
            }
        }
    }
}

juce::String imageMime(const juce::String& ext)
{
    const auto e = ext.toLowerCase();
    if (e == "png") return "image/png";
    if (e == "heic") return "image/heic";
    if (e == "heif") return "image/heif";
    if (e == "webp") return "image/webp";
    if (e == "gif") return "image/gif";
    if (e == "jpg" || e == "jpeg") return "image/jpeg";
    return {};
}

juce::String audioMime(const juce::String& ext)
{
    const auto e = ext.toLowerCase();
    if (e == "m4a" || e == "aac" || e == "mp4") return "audio/mp4";
    if (e == "mp3") return "audio/mpeg";
    if (e == "wav") return "audio/wav";
    if (e == "aif" || e == "aiff") return "audio/aiff";
    if (e == "caf") return "audio/x-caf";
    if (e == "flac") return "audio/flac";
    if (e == "ogg") return "audio/ogg";
    if (e == "webm") return "audio/webm";
    return {};
}
} // namespace

Collection::Collection(const juce::File& folder, std::function<bool(const juce::String&)> knownBird)
    : dir(folder), known(std::move(knownBird))
{
    formatManager.registerBasicFormats();
}

juce::String Collection::audioExt(const juce::String& mime)
{
    if (mime.contains("mp4") || mime.contains("aac")) return "m4a";
    if (mime.contains("mpeg")) return "mp3";
    if (mime.contains("webm")) return "webm";
    if (mime.contains("ogg")) return "ogg";
    if (mime.contains("wav")) return "wav";
    if (mime.contains("aiff")) return "aiff";
    if (mime.contains("caf")) return "caf";
    if (mime.contains("flac")) return "flac";
    return "bin";
}

juce::String Collection::imageExt(const juce::String& mime)
{
    if (mime.contains("png")) return "png";
    if (mime.contains("heic")) return "heic";
    if (mime.contains("heif")) return "heif";
    if (mime.contains("webp")) return "webp";
    if (mime.contains("gif")) return "gif";
    return "jpg";
}

juce::String Collection::now() { return stamp(juce::Time::getCurrentTime()); }

void Collection::load()
{
    recs.clear();
    pics.clear();
    const auto doc = juce::JSON::parse(dir.getChildFile("collection.json"));
    if (auto* a = doc["recordings"].getArray())
        for (const auto& v : *a)
        {
            CollRecording r;
            r.id = str(v["id"]);
            r.bird = str(v["bird"]);
            r.latin = str(v["latin"]);
            r.type = typeIndex(str(v["type"]));
            r.seconds = juce::roundToInt(num(v["seconds"], 0.0));
            r.date = str(v["date"]);
            r.confidence = static_cast<float>(num(v["confidence"], -1.0));
            r.mime = str(v["mime"]);
            r.audio = str(v["audio"]);
            r.thumb = str(v["thumb"]);
            r.from = str(v["from"]);
            if (r.id.isNotEmpty() && r.audio.isNotEmpty())
                recs.push_back(r);
        }
    if (auto* a = doc["pictures"].getArray())
        for (const auto& v : *a)
        {
            CollPicture p;
            p.id = str(v["id"]);
            p.bird = str(v["bird"]);
            p.date = str(v["date"]);
            p.mime = str(v["mime"]);
            p.image = str(v["image"]);
            p.from = str(v["from"]);
            if (p.id.isNotEmpty() && p.image.isNotEmpty())
                pics.push_back(p);
        }
    sort();
}

void Collection::sort()
{
    std::stable_sort(recs.begin(), recs.end(), [](const auto& a, const auto& b) { return a.date > b.date; });
    std::stable_sort(pics.begin(), pics.end(), [](const auto& a, const auto& b) { return a.date > b.date; });
}

void Collection::save() const
{
    juce::Array<juce::var> r, p;
    for (const auto& x : recs)
    {
        auto* o = new juce::DynamicObject();
        o->setProperty("id", x.id);
        o->setProperty("bird", x.bird);
        o->setProperty("latin", x.latin);
        o->setProperty("type", kTypeIds[juce::jlimit(0, 3, x.type)]);
        o->setProperty("seconds", x.seconds);
        o->setProperty("date", x.date);
        o->setProperty("confidence", x.confidence);
        o->setProperty("mime", x.mime);
        o->setProperty("audio", x.audio);
        o->setProperty("thumb", x.thumb);
        o->setProperty("from", x.from);
        r.add(juce::var(o));
    }
    for (const auto& x : pics)
    {
        auto* o = new juce::DynamicObject();
        o->setProperty("id", x.id);
        o->setProperty("bird", x.bird);
        o->setProperty("date", x.date);
        o->setProperty("mime", x.mime);
        o->setProperty("image", x.image);
        o->setProperty("from", x.from);
        p.add(juce::var(o));
    }
    auto* doc = new juce::DynamicObject();
    doc->setProperty("format", "pipp-collection");
    doc->setProperty("version", 1);
    doc->setProperty("recordings", r);
    doc->setProperty("pictures", p);
    dir.createDirectory();
    const auto target = dir.getChildFile("collection.json");
    juce::TemporaryFile tmp(target);
    if (tmp.getFile().replaceWithText(juce::JSON::toString(juce::var(doc))))
        (void) tmp.overwriteTargetFileWithTemporary();
}

// recordings/<id>.<ext> with the id made safe for a file name, and a number
// added if that name is taken.
juce::String Collection::freeName(const juce::String& sub, const juce::String& id, const juce::String& ext) const
{
    juce::String safe;
    for (auto c : id)
        safe += (juce::CharacterFunctions::isLetterOrDigit(c) || c == '-' || c == '_') && c < 128 ? juce::String::charToString(c) : "_";
    if (safe.isEmpty())
        safe = "item";
    auto name = sub + "/" + safe + "." + ext;
    for (int n = 2; dir.getChildFile(name).exists(); ++n)
        name = sub + "/" + safe + "-" + juce::String(n) + "." + ext;
    return name;
}

Collection::ImportResult Collection::importExport(const juce::File& zipFile)
{
    ImportResult res;
    if (! zipFile.existsAsFile())
    {
        res.errorKey = "coll.err_read";
        return res;
    }
    juce::ZipFile zip(zipFile);
    if (zip.getNumEntries() == 0)
    {
        res.errorKey = "coll.err_zip";
        return res;
    }
    auto read = [&zip](const juce::String& name, juce::MemoryBlock& out) {
        if (name.isEmpty())
            return false;
        const auto* e = zip.getEntry(name);
        if (e == nullptr)
            return false;
        std::unique_ptr<juce::InputStream> s(zip.createStreamForEntry(*e));
        if (s == nullptr)
            return false;
        out.reset();
        s->readIntoMemoryBlock(out);
        return out.getSize() == static_cast<std::size_t>(e->uncompressedSize);
    };

    juce::MemoryBlock mb;
    if (! read("manifest.json", mb))
    {
        res.errorKey = "coll.err_manifest";
        return res;
    }
    const auto m = juce::JSON::parse(mb.toString());
    if (! m.isObject() || str(m["format"]) != kFormat)
    {
        res.errorKey = "coll.err_format";
        return res;
    }

    dir.getChildFile("recordings").createDirectory();
    dir.getChildFile("pictures").createDirectory();
    auto haveRec = [this](const juce::String& id) { return std::any_of(recs.begin(), recs.end(), [&](const auto& r) { return r.id == id; }); };
    auto havePic = [this](const juce::String& id) { return std::any_of(pics.begin(), pics.end(), [&](const auto& p) { return p.id == id; }); };

    if (auto* a = m["recordings"].getArray())
        for (const auto& v : *a)
        {
            const auto id = str(v["id"]);
            if (id.isEmpty()) { ++res.broken; continue; }
            if (haveRec(id)) { ++res.known; continue; }
            if (! read(str(v["audio"]), mb)) { ++res.broken; continue; }
            CollRecording r;
            r.id = id;
            r.mime = str(v["mime"]).isNotEmpty() ? str(v["mime"]) : juce::String("audio/mp4");
            const auto ext = str(v["audio"]).fromLastOccurrenceOf(".", false, false);
            r.audio = freeName("recordings", id, ext.isNotEmpty() && ! ext.containsChar('/') ? ext : audioExt(r.mime));
            if (! dir.getChildFile(r.audio).replaceWithData(mb.getData(), mb.getSize())) { ++res.broken; continue; }
            if (read(str(v["thumb"]), mb))
            {
                r.thumb = freeName("recordings", id, "png");
                if (! dir.getChildFile(r.thumb).replaceWithData(mb.getData(), mb.getSize()))
                    r.thumb = {};
            }
            const auto bird = str(v["bird"]);
            r.bird = known(bird) ? bird : juce::String();
            r.latin = str(v["latin"]).isNotEmpty() ? str(v["latin"]) : known(bird) ? juce::String() : bird;
            r.type = typeIndex(str(v["type"]));
            r.seconds = std::max(0, juce::roundToInt(num(v["seconds"], 0.0)));
            r.date = str(v["date"]);
            const auto conf = static_cast<float>(num(v["confidence"], 0.0));
            r.confidence = conf < 0.0f ? -1.0f : std::min(1.0f, conf); // -1: a file, no match
            r.from = "phone";
            recs.push_back(r);
            ++res.recordings;
        }
    if (auto* a = m["pictures"].getArray())
        for (const auto& v : *a)
        {
            const auto id = str(v["id"]);
            if (id.isEmpty()) { ++res.broken; continue; }
            if (havePic(id)) { ++res.known; continue; }
            if (! read(str(v["image"]), mb)) { ++res.broken; continue; }
            CollPicture p;
            p.id = id;
            p.mime = str(v["mime"]).isNotEmpty() ? str(v["mime"]) : juce::String("image/jpeg");
            const auto ext = str(v["image"]).fromLastOccurrenceOf(".", false, false);
            p.image = freeName("pictures", id, ext.isNotEmpty() && ! ext.containsChar('/') ? ext : imageExt(p.mime));
            if (! dir.getChildFile(p.image).replaceWithData(mb.getData(), mb.getSize())) { ++res.broken; continue; }
            const auto bird = str(v["bird"]);
            p.bird = known(bird) ? bird : juce::String();
            p.date = str(v["date"]);
            p.from = "phone";
            pics.push_back(p);
            ++res.pictures;
        }
    sort();
    save();
    return res;
}

juce::Image Collection::thumbnail(juce::AudioFormatReader& reader) const
{
    constexpr int W = 120, H = 40, N = 1024;
    const double sr = reader.sampleRate > 0.0 ? reader.sampleRate : 48000.0;
    const auto len = static_cast<int>(std::min<juce::int64>(reader.lengthInSamples, static_cast<juce::int64>(30.0 * sr)));
    juce::Image img(juce::Image::RGB, W, H, true);
    const juce::Colour face(0xffefe8d6), ink(0xff221c14);
    if (len <= 0)
    {
        img.clear(img.getBounds(), face);
        return img;
    }
    juce::AudioBuffer<float> buf(1, len + N);
    buf.clear();
    reader.read(&buf, 0, len, 0, true, false);
    const float* ch = buf.getReadPointer(0);

    const int top = std::min(N / 2, juce::roundToInt(8000.0 / sr * N));
    std::vector<std::complex<float>> a(N);
    std::vector<float> cols(static_cast<std::size_t>(W * H));
    float peak = 1.0e-9f;
    for (int x = 0; x < W; ++x)
    {
        const int at = static_cast<int>(static_cast<double>(x) / W * std::max(0, len - N));
        for (int i = 0; i < N; ++i)
            a[static_cast<std::size_t>(i)] = { ch[at + i] * (0.5f - 0.5f * std::cos(2.0f * juce::MathConstants<float>::pi * static_cast<float>(i) / N)), 0.0f };
        fft(a);
        for (int y = 0; y < H; ++y)
        {
            const int b0 = y * top / H, b1 = std::max(b0 + 1, (y + 1) * top / H);
            float mag = 0.0f;
            for (int b = b0; b < b1; ++b)
                mag = std::max(mag, std::abs(a[static_cast<std::size_t>(b)]));
            cols[static_cast<std::size_t>(x * H + y)] = mag;
            peak = std::max(peak, mag);
        }
    }
    for (int x = 0; x < W; ++x)
        for (int y = 0; y < H; ++y)
        {
            const float db = 20.0f * std::log10(cols[static_cast<std::size_t>(x * H + y)] / peak + 1.0e-9f);
            const float t = juce::jlimit(0.0f, 1.0f, (db + 50.0f) / 40.0f);
            img.setPixelAt(x, H - 1 - y, face.interpolatedWith(ink, t));
        }
    return img;
}

Collection::AddResult Collection::addFiles(const juce::Array<juce::File>& files, const juce::String& bird)
{
    AddResult res;
    dir.getChildFile("recordings").createDirectory();
    dir.getChildFile("pictures").createDirectory();
    for (const auto& f : files)
    {
        const auto ext = f.getFileExtension().trimCharactersAtStart(".").toLowerCase();
        const auto date = stamp(f.getLastModificationTime());
        const auto id = juce::String::toHexString(juce::Time::currentTimeMillis()) + "-" + juce::String::toHexString(juce::Random::getSystemRandom().nextInt()).substring(0, 6);
        if (const auto mime = imageMime(ext); mime.isNotEmpty())
        {
            CollPicture p { id, bird, date, mime, freeName("pictures", id, ext), "file" };
            if (! f.copyFileTo(dir.getChildFile(p.image))) { ++res.skipped; continue; }
            pics.push_back(p);
            ++res.added;
            continue;
        }
        std::unique_ptr<juce::AudioFormatReader> reader(formatManager.createReaderFor(f));
        const auto mime = audioMime(ext);
        if (reader == nullptr && mime.isEmpty()) { ++res.skipped; continue; }
        CollRecording r;
        r.id = id;
        r.bird = bird;
        r.date = date;
        r.mime = mime.isNotEmpty() ? mime : juce::String("audio/mp4");
        r.audio = freeName("recordings", id, ext.isNotEmpty() ? ext : juce::String("bin"));
        r.from = "file";
        if (! f.copyFileTo(dir.getChildFile(r.audio))) { ++res.skipped; continue; }
        if (reader != nullptr && reader->sampleRate > 0.0)
        {
            r.seconds = juce::roundToInt(static_cast<double>(reader->lengthInSamples) / reader->sampleRate);
            const auto png = thumbnail(*reader);
            r.thumb = freeName("recordings", id, "png");
            juce::FileOutputStream out(dir.getChildFile(r.thumb));
            if (! out.openedOk() || ! juce::PNGImageFormat().writeImageToStream(png, out))
                r.thumb = {};
        }
        recs.push_back(r);
        ++res.added;
    }
    sort();
    save();
    return res;
}

bool Collection::exportTo(const juce::File& zipFile, const std::vector<CollRecording>& r, const std::vector<CollPicture>& p) const
{
    juce::ZipFile::Builder zip;
    juce::Array<juce::var> rj, pj;
    for (const auto& x : r)
    {
        const auto audio = "recordings/" + dir.getChildFile(x.audio).getFileName();
        zip.addFile(dir.getChildFile(x.audio), 0, audio);
        juce::String thumb;
        if (x.thumb.isNotEmpty() && dir.getChildFile(x.thumb).existsAsFile())
        {
            thumb = "recordings/" + dir.getChildFile(x.thumb).getFileName();
            zip.addFile(dir.getChildFile(x.thumb), 0, thumb);
        }
        auto* o = new juce::DynamicObject();
        o->setProperty("id", x.id);
        o->setProperty("bird", x.bird);
        o->setProperty("latin", x.latin);
        o->setProperty("type", kTypeIds[juce::jlimit(0, 3, x.type)]);
        o->setProperty("seconds", x.seconds);
        o->setProperty("date", x.date);
        o->setProperty("confidence", x.confidence);
        o->setProperty("mime", x.mime);
        o->setProperty("audio", audio);
        o->setProperty("thumb", thumb);
        rj.add(juce::var(o));
    }
    for (const auto& x : p)
    {
        const auto image = "pictures/" + dir.getChildFile(x.image).getFileName();
        zip.addFile(dir.getChildFile(x.image), 0, image);
        auto* o = new juce::DynamicObject();
        o->setProperty("id", x.id);
        o->setProperty("bird", x.bird);
        o->setProperty("date", x.date);
        o->setProperty("mime", x.mime);
        o->setProperty("image", image);
        pj.add(juce::var(o));
    }
    auto* m = new juce::DynamicObject();
    m->setProperty("format", kFormat);
    m->setProperty("version", 1);
    m->setProperty("exported", now());
    m->setProperty("recordings", rj);
    m->setProperty("pictures", pj);
    const auto text = juce::JSON::toString(juce::var(m));
    zip.addEntry(std::make_unique<juce::MemoryInputStream>(text.toRawUTF8(), text.getNumBytesAsUTF8(), true), 0, "manifest.json",
                 juce::Time::getCurrentTime());

    juce::TemporaryFile tmp(zipFile);
    {
        juce::FileOutputStream out(tmp.getFile());
        if (! out.openedOk() || ! zip.writeToStream(out, nullptr))
            return false;
    }
    return tmp.overwriteTargetFileWithTemporary();
}

void Collection::removeRecording(const juce::String& id)
{
    for (auto it = recs.begin(); it != recs.end(); ++it)
        if (it->id == id)
        {
            file(it->audio).deleteFile();
            if (it->thumb.isNotEmpty())
                file(it->thumb).deleteFile();
            recs.erase(it);
            save();
            return;
        }
}

void Collection::removePicture(const juce::String& id)
{
    for (auto it = pics.begin(); it != pics.end(); ++it)
        if (it->id == id)
        {
            file(it->image).deleteFile();
            pics.erase(it);
            save();
            return;
        }
}
} // namespace pipp::ui
