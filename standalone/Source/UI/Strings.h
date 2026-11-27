#pragma once

// Interface strings from data/strings/<lang>.json. A missing key shows as
// <key> so it is easy to spot.

#include <juce_core/juce_core.h>

#include <initializer_list>
#include <utility>

namespace pipp::ui
{
class Strings
{
public:
    void load(const juce::File& dataDir, const juce::String& language)
    {
        lang = language;
        table = juce::JSON::parse(dataDir.getChildFile("strings").getChildFile(language + ".json"));
    }

    const juce::String& language() const noexcept { return lang; }
    bool norwegian() const noexcept { return lang == "no"; }

    juce::String operator()(const juce::String& key) const
    {
        if (auto* o = table.getDynamicObject(); o != nullptr && o->hasProperty(key))
            return o->getProperty(key).toString();
        return "<" + key + ">";
    }

    // Replaces {name} fields.
    juce::String format(const juce::String& key, std::initializer_list<std::pair<const char*, juce::String>> fields) const
    {
        auto s = (*this)(key);
        for (const auto& f : fields)
            s = s.replace("{" + juce::String(f.first) + "}", f.second);
        return s;
    }

    // Lower case that also lowers Æ, Ø and Å, which toLowerCase() leaves.
    static juce::String lower(const juce::String& s)
    {
        return s.toLowerCase()
            .replace(juce::CharPointer_UTF8("\xc3\x86"), juce::CharPointer_UTF8("\xc3\xa6"))
            .replace(juce::CharPointer_UTF8("\xc3\x98"), juce::CharPointer_UTF8("\xc3\xb8"))
            .replace(juce::CharPointer_UTF8("\xc3\x85"), juce::CharPointer_UTF8("\xc3\xa5"));
    }

    // Upper case that also raises æ, ø and å.
    static juce::String upper(const juce::String& s)
    {
        return s.toUpperCase()
            .replace(juce::CharPointer_UTF8("\xc3\xa6"), juce::CharPointer_UTF8("\xc3\x86"))
            .replace(juce::CharPointer_UTF8("\xc3\xb8"), juce::CharPointer_UTF8("\xc3\x98"))
            .replace(juce::CharPointer_UTF8("\xc3\xa5"), juce::CharPointer_UTF8("\xc3\x85"));
    }

    // A {en, no, verified} text from bird.json in the current language. Not
    // verified: [TO VERIFY] after it, or alone when the text is empty.
    juce::String field(const juce::var& f) const
    {
        const auto marker = (*this)("to_verify");
        auto text = f[juce::Identifier(lang)].toString();
        if (static_cast<bool>(f["verified"]))
            return text;
        if (text.isEmpty())
            return marker;
        return text.contains(marker) ? text : text + " " + marker;
    }

private:
    juce::String lang { "en" };
    juce::var table;
};
} // namespace pipp::ui
