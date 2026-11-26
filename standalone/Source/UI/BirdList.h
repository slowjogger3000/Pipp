#pragma once

// The 240px bird list: a sheet well, 24px group headers on panel and 24px
// rows, the selected row in ink. A bird without data in this build is
// hatched and disabled. With 50 birds it scrolls (agreed with Eirik
// 2026-11-26): mouse wheel or trackpad, a thin bar on the right, and a newly
// selected bird is brought into view.

#include "Strings.h"
#include "Theme.h"

#include <algorithm>
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

        // Bring a newly selected bird into view, keeping its header too when
        // it is the first in its group.
        if (selected != shownSelected)
        {
            shownSelected = selected;
            const int top = rowTop(selected);
            if (top >= 0)
            {
                const int view = r.getHeight() - 2;
                if (top - 24 < scrollY)
                    scrollY = top - 24;
                else if (top + 24 > scrollY + view)
                    scrollY = top + 24 - view;
            }
        }
        clampScroll();

        int y = 1 - scrollY;
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

        // Scroll bar: a thin shadow-coloured thumb, only when the list is longer.
        const int view = r.getHeight() - 2, content = contentHeight();
        if (content > view)
        {
            const int h = std::max(24, view * view / content);
            const int t = 1 + (view - h) * scrollY / (content - view);
            g.setColour(colour::shadow);
            g.fillRect(r.getRight() - 1 - 5, t, 4, h);
        }
    }

    void mouseWheelMove(const juce::MouseEvent&, const juce::MouseWheelDetails& w) override
    {
        const int before = scrollY;
        scrollY -= juce::roundToInt(w.deltaY * 24.0f * 8.0f);
        clampScroll();
        if (scrollY != before)
            repaint();
    }

    void mouseUp(const juce::MouseEvent& e) override
    {
        for (const auto& [rect, index] : rows)
            if (rect.contains(e.getPosition()) && birds[static_cast<std::size_t>(index)].available && onSelect)
                onSelect(index);
    }

private:
    int contentHeight() const
    {
        int h = 0;
        for (const auto& grp : groups)
        {
            h += 24;
            for (const auto& b : birds)
                if (b.group == grp)
                    h += 24;
        }
        return h;
    }

    // The bird's row top in content pixels, -1 if it is not listed.
    int rowTop(int index) const
    {
        if (index < 0 || index >= static_cast<int>(birds.size()))
            return -1;
        int y = 0;
        for (const auto& grp : groups)
        {
            y += 24;
            for (int i = 0; i < static_cast<int>(birds.size()); ++i)
            {
                if (birds[static_cast<std::size_t>(i)].group != grp)
                    continue;
                if (i == index)
                    return y;
                y += 24;
            }
        }
        return -1;
    }

    void clampScroll()
    {
        scrollY = juce::jlimit(0, std::max(0, contentHeight() - (getHeight() - 2)), scrollY);
    }

    int scrollY = 0;
    int shownSelected = -2;
    std::vector<std::pair<juce::Rectangle<int>, int>> rows;
};
} // namespace tipp::ui
