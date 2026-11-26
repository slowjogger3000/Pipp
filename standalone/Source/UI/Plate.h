#pragma once

// The ink plate from data/birds/<id>/plate.json, in a 280x240 box scaled to
// the well. Beak, tail and sound arcs follow the engine's voice level.
// Callout values are bird facts: an unverified one carries [TO VERIFY].

#include "Theme.h"

#include <map>
#include <vector>

namespace tipp::ui
{
class Plate final : public juce::Component
{
public:
    Plate() { setInterceptsMouseClicks(false, false); }

    juce::String toVerify { "[TO VERIFY]" };
    juce::String language { "en" };
    std::map<juce::String, juce::String> calloutLabels; // id to caps label

    // Returns an error text, empty on success.
    juce::String load(const juce::File& file)
    {
        layers.clear();
        clips.clear();
        hatches.clear();
        pivots.clear();
        doc = juce::JSON::parse(file);
        if (! doc.isObject())
            return "plate.json missing or not JSON";

        auto parsePath = [](const juce::var& v) { return juce::Drawable::parseSVGPath(v.toString()); };

        if (auto* c = doc["clips"].getDynamicObject())
            for (const auto& p : c->getProperties())
                clips[p.name.toString()] = parsePath(p.value);

        if (auto* h = doc["hatch"].getDynamicObject())
            for (const auto& p : h->getProperties())
            {
                const auto& rect = p.value["rect"];
                Hatch hh;
                hh.area = { static_cast<float>(rect[0]), static_cast<float>(rect[1]),
                            static_cast<float>(rect[2]) - static_cast<float>(rect[0]),
                            static_cast<float>(rect[3]) - static_cast<float>(rect[1]) };
                hh.up = static_cast<bool>(p.value["up"]);
                hh.clip = p.value["clip"].toString();
                hatches[p.name.toString()] = hh;
            }

        if (auto* pv = doc["pivots"].getDynamicObject())
            for (const auto& p : pv->getProperties())
                pivots[p.name.toString()] = { { static_cast<float>(p.value["at"][0]), static_cast<float>(p.value["at"][1]) },
                                              static_cast<float>(p.value["deg"]) };

        if (auto* arr = doc["layers"].getArray())
            for (const auto& l : *arr)
            {
                Layer layer;
                if (l.hasProperty("path"))     layer.path = parsePath(l["path"]);
                if (l.hasProperty("clip"))     { layer.path = clips[l["clip"].toString()]; }
                layer.fill = l["fill"].toString();
                layer.stroke = l.hasProperty("stroke") ? static_cast<float>(l["stroke"]) : 0.0f;
                layer.part = l["part"].toString();
                layer.hatch = l["hatch"].toString();
                layer.variant = l["variant"].toString();
                layer.within = l["within"].toString();
                if (l.hasProperty("eye"))
                {
                    layer.isEye = true;
                    layer.eye = { static_cast<float>(l["eye"][0]), static_cast<float>(l["eye"][1]) };
                    layer.pupil = static_cast<float>(l["pupil"]);
                }
                layers.push_back(std::move(layer));
            }
        repaint();
        return {};
    }

    // "male", "female" or "juvenile".
    void setVariant(const juce::String& v)
    {
        if (v != variant)
        {
            variant = v;
            repaint();
        }
    }

    juce::String caption() const
    {
        const auto& c = doc["captions"][juce::Identifier(variant)];
        auto s = c[juce::Identifier(language)].toString();
        if (! static_cast<bool>(c["verified"]))
            s << " " << toVerify;
        return s;
    }

    // 0 to 1, from the engine's voice level.
    void setOpen(float o)
    {
        if (std::abs(o - open) > 0.005f)
        {
            open = o;
            repaint();
        }
    }

    void paint(juce::Graphics& g) override
    {
        const auto box = doc["box"];
        const float bw = box.size() == 2 ? static_cast<float>(box[0]) : 280.0f;
        const float bh = box.size() == 2 ? static_cast<float>(box[1]) : 240.0f;
        const float s = std::min(static_cast<float>(getWidth()) / bw, static_cast<float>(getHeight()) / bh);
        const auto toScreen = juce::AffineTransform::scale(s).translated((static_cast<float>(getWidth()) - bw * s) * 0.5f,
                                                                         (static_cast<float>(getHeight()) - bh * s) * 0.5f);
        const auto& vdata = doc["variants"][juce::Identifier(variant)];

        for (const auto& l : layers)
        {
            const auto t = partTransform(l.part).followedBy(toScreen);
            if (l.part == "arcs")
            {
                if (open > 0.05f)
                {
                    g.setColour(colour::ink.withAlpha(juce::jlimit(0.0f, 1.0f, open * 1.6f)));
                    g.strokePath(l.path, juce::PathStrokeType(l.stroke * s), t);
                }
                continue;
            }
            if (l.hatch.isNotEmpty())
            {
                paintHatch(g, l.hatch, static_cast<float>(vdata[l.hatch == "body" ? "body_pitch" : "wing_pitch"]), toScreen, s);
                continue;
            }
            if (l.isEye)
            {
                const float ring = static_cast<float>(vdata["eye_ring"]);
                const auto c = l.eye.transformedBy(toScreen);
                if (ring > 0.0f)
                {
                    g.setColour(colour::face);
                    g.fillEllipse(c.x - ring * s, c.y - ring * s, 2.0f * ring * s, 2.0f * ring * s);
                    g.setColour(colour::ink);
                    g.drawEllipse(c.x - ring * s, c.y - ring * s, 2.0f * ring * s, 2.0f * ring * s, s);
                }
                g.setColour(colour::ink);
                g.fillEllipse(c.x - l.pupil * s, c.y - l.pupil * s, 2.0f * l.pupil * s, 2.0f * l.pupil * s);
                continue;
            }

            juce::Path p = l.path;
            if (l.variant.isNotEmpty())
            {
                const auto d = vdata[juce::Identifier(l.variant)].toString();
                if (d.isEmpty())
                    continue;
                p = juce::Drawable::parseSVGPath(d);
            }

            juce::Graphics::ScopedSaveState save(g);
            if (l.within.isNotEmpty())
                g.reduceClipRegion(clips[l.within], toScreen);

            if (l.fill.isNotEmpty())
            {
                g.setColour(fillColour(l.fill, vdata));
                g.fillPath(p, t);
            }
            if (l.stroke > 0.0f)
            {
                g.setColour(colour::ink);
                g.strokePath(p, juce::PathStrokeType(l.stroke * s, juce::PathStrokeType::curved), t);
            }
        }

        paintCallouts(g, toScreen, s);
    }

private:
    struct Layer
    {
        juce::Path path;
        juce::String fill, part, hatch, variant, within;
        float stroke = 0.0f;
        bool isEye = false;
        juce::Point<float> eye;
        float pupil = 0.0f;
    };
    struct Hatch
    {
        juce::Rectangle<float> area;
        bool up = true;
        juce::String clip;
    };
    struct Pivot
    {
        juce::Point<float> at;
        float deg = 0.0f;
    };

    juce::AffineTransform partTransform(const juce::String& part) const
    {
        auto it = pivots.find(part);
        if (it == pivots.end())
            return {};
        const float a = juce::degreesToRadians(it->second.deg * open);
        return juce::AffineTransform::rotation(a, it->second.at.x, it->second.at.y);
    }

    static juce::Colour fillColour(const juce::String& name, const juce::var& vdata)
    {
        const auto n = name == "bill" ? vdata["bill"].toString() : name;
        if (n == "shadow") return colour::shadow;
        if (n == "ink")    return colour::ink;
        return colour::face;
    }

    void paintHatch(juce::Graphics& g, const juce::String& id, float pitch, const juce::AffineTransform& toScreen, float s)
    {
        auto it = hatches.find(id);
        if (it == hatches.end() || pitch <= 0.0f)
            return;
        const auto& h = it->second;
        juce::Graphics::ScopedSaveState save(g);
        g.reduceClipRegion(clips[h.clip], toScreen);
        juce::Path lines;
        const float x0 = h.area.getX(), y0 = h.area.getY(), y1 = h.area.getBottom(), hh = h.area.getHeight();
        for (float x = x0 - hh; x < h.area.getRight(); x += pitch)
        {
            if (h.up) { lines.startNewSubPath(x, y1); lines.lineTo(x + hh, y0); }
            else      { lines.startNewSubPath(x, y0); lines.lineTo(x + hh, y1); }
        }
        g.setColour(colour::ink);
        g.strokePath(lines, juce::PathStrokeType(s), toScreen);
    }

    void paintCallouts(juce::Graphics& g, const juce::AffineTransform& toScreen, float s)
    {
        const auto* arr = doc["callouts"].getArray();
        if (arr == nullptr)
            return;
        const auto lab = mono(8.0f, 600, 0.06f);
        const auto val = mono(8.0f, 500, 0.06f);
        for (const auto& c : *arr)
        {
            g.setColour(colour::inkSoft);
            g.strokePath(juce::Drawable::parseSVGPath(c["leader"].toString()), juce::PathStrokeType(s), toScreen);

            const auto& v = c[juce::Identifier(variant)];
            juce::String value = v[juce::Identifier(language)].toString();
            const bool verified = static_cast<bool>(v["verified"]);

            const juce::String align = c["align"].toString();
            const auto just = align == "centre" ? juce::Justification::centred
                            : align == "right"  ? juce::Justification::centredRight
                                                : juce::Justification::centredLeft;
            auto pt = juce::Point<float>(static_cast<float>(c["at"][0]), static_cast<float>(c["at"][1])).transformedBy(toScreen);
            auto row = [&](int line) {
                const float w = 160.0f;
                const float x = align == "centre" ? pt.x - w * 0.5f : align == "right" ? pt.x - w : pt.x;
                // The design's text y is a baseline; the rows sit 10px apart.
                return juce::Rectangle<float>(x, pt.y - 8.0f + 10.0f * static_cast<float>(line), w, 10.0f);
            };
            g.setFont(lab);
            g.setColour(colour::inkSoft);
            g.drawText(calloutLabels[c["id"].toString()], row(0), just, false);
            g.setFont(val);
            g.setColour(colour::ink);
            int line = 1;
            if (value.isNotEmpty())
                g.drawText(value, row(line++), just, false);
            if (! verified)
            {
                g.setColour(colour::inkSoft);
                g.drawText(toVerify, row(line), just, false);
            }
        }
    }

    juce::var doc;
    std::vector<Layer> layers;
    std::map<juce::String, juce::Path> clips;
    std::map<juce::String, Hatch> hatches;
    std::map<juce::String, Pivot> pivots;
    juce::String variant { "male" };
    float open = 0.0f;
};
} // namespace tipp::ui
