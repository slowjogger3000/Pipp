#pragma once

// The 240px bird list: a sheet well, 24px group headers on panel and 24px
// rows, the selected row in ink. A bird without data in this build is
// hatched and disabled.

#include "Strings.h"
#include "Theme.h"

#include <functional>
#include <vector>

namespace tipp::ui
{
struct BirdEntry
{
    juce::String id, number, group, nameNo, nameEn, latin;
    bool available = false;

    juce::String name(bool norwegian) const { return norwegian ? nameNo : nameEn; }
};

class BirdList final : public juce::Component
{
public:
    std::vector<BirdEntry> birds;
    juce::StringArray groups;
    int selected = -1;
    const Strings* strings = nullptr;
    std::function<void(int)> onSelect;

    void paint(juce::Graphics& g) override
    {
        const auto r = getLocalBounds();
        draw::inset(g, r, colour::sheet);
        juce::Graphics::ScopedSaveState save(g);
        g.reduceClipRegion(r.reduced(1));

        int y = 1;
        rows.clear();
        for (int gi = 0; gi < groups.size(); ++gi)
        {
            const juce::Rectangle<int> head(1, y, r.getWidth() - 2, 24);
            g.setColour(colour::panel);
            g.fillRect(head);
            g.setColour(colour::divider);
            if (gi > 0)
                g.fillRect(head.getX(), head.getY(), head.getWidth(), 1);
            g.fillRect(head.getX(), head.getBottom() - 1, head.getWidth(), 1);
            g.setColour(colour::inkSoft);
            g.setFont(mono(9.0f, 600, 0.14f));
            g.drawText(strings != nullptr ? (*strings)("group." + groups[gi]) : groups[gi], head.withTrimmedLeft(8),
                       juce::Justification::centredLeft, false);
            y += 24;

            for (int i = 0; i < static_cast<int>(birds.size()); ++i)
            {
                const auto& b = birds[static_cast<std::size_t>(i)];
                if (b.group != groups[gi])
                    continue;
                const juce::Rectangle<int> row(1, y, r.getWidth() - 2, 24);
                rows.push_back({ row, i });
                const bool sel = i == selected;
                if (sel)
                {
                    g.setColour(colour::ink);
                    g.fillRect(row);
                }
                else if (! b.available)
                    draw::hatch(g, row);

                g.setFont(mono(13.0f, 400));
                g.setColour(sel ? colour::onInk : colour::inkSoft);
                g.drawText(b.number, row.withTrimmedLeft(8).withWidth(20), juce::Justification::centredLeft, false);
                g.setColour(sel ? colour::onInk : b.available ? colour::ink : colour::inkSoft);
                const bool no = strings != nullptr && strings->norwegian();
                g.drawFittedText(b.name(no), row.withTrimmedLeft(36).withTrimmedRight(4), juce::Justification::centredLeft, 1, 0.8f);
                y += 24;
            }
        }
    }

    void mouseUp(const juce::MouseEvent& e) override
    {
        for (const auto& [rect, index] : rows)
            if (rect.contains(e.getPosition()) && birds[static_cast<std::size_t>(index)].available && onSelect)
                onSelect(index);
    }

private:
    std::vector<std::pair<juce::Rectangle<int>, int>> rows;
};
} // namespace tipp::ui
