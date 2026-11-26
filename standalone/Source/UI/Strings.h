#pragma once

// Interface strings from data/strings/<lang>.json. A missing key shows as
// <key> so it is easy to spot.

#include <juce_core/juce_core.h>

#include <initializer_list>
#include <utility>

namespace tipp::ui
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

private:
    juce::String lang { "en" };
    juce::var table;
};
} // namespace tipp::ui
