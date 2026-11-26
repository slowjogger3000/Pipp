#include "Drawn.h"

#include <algorithm>
#include <cmath>
#include <utility>
#include <vector>

namespace tipp
{
namespace
{
// Last index of the note that starts at a.
int runEnd(const DrawnLine& line, int a) noexcept
{
    int b = a;
    while (b + 1 < line.count && line.pts[static_cast<std::size_t>(b + 1)].joinPrev)
        ++b;
    return b;
}

float slope(const DrawnLine& line, int k) noexcept
{
    const auto& p = line.pts[static_cast<std::size_t>(k)];
    const auto& q = line.pts[static_cast<std::size_t>(k + 1)];
    const float h = q.tMs - p.tMs;
    return h > 1.0e-3f ? (q.hz - p.hz) / h : 0.0f;
}

// Fritsch and Carlson: tangents limited to 3 times the secant keep each
// segment monotone.
float tangent(const DrawnLine& line, int i, int a, int b) noexcept
{
    if (i == a)
        return slope(line, a);
    if (i == b)
        return slope(line, b - 1);
    const float dp = slope(line, i - 1), dn = slope(line, i);
    if (dp * dn <= 0.0f)
        return 0.0f;
    const float m = 0.5f * (dp + dn);
    const float cap = 3.0f * std::min(std::fabs(dp), std::fabs(dn));
    return std::fabs(m) > cap ? std::copysign(cap, m) : m;
}

float pitchIn(const DrawnLine& line, int a, int b, float t) noexcept
{
    int k = a;
    while (k + 1 < b && line.pts[static_cast<std::size_t>(k + 1)].tMs < t)
        ++k;
    const auto& p = line.pts[static_cast<std::size_t>(k)];
    const auto& q = line.pts[static_cast<std::size_t>(k + 1)];
    const float h = q.tMs - p.tMs;
    if (h <= 1.0e-3f)
        return q.hz;
    const float s = std::clamp((t - p.tMs) / h, 0.0f, 1.0f);
    const float s2 = s * s, s3 = s2 * s;
    const float y0 = p.hz, y1 = q.hz;
    const float y = (2.0f * s3 - 3.0f * s2 + 1.0f) * y0 + (s3 - 2.0f * s2 + s) * h * tangent(line, k, a, b)
                  + (-2.0f * s3 + 3.0f * s2) * y1 + (s3 - s2) * h * tangent(line, k + 1, a, b);
    return y;
}

// True if a joined segment runs across t, strictly inside it.
bool covered(const DrawnLine& line, float t) noexcept
{
    for (int k = 0; k + 1 < line.count; ++k)
    {
        const auto& p = line.pts[static_cast<std::size_t>(k)];
        const auto& q = line.pts[static_cast<std::size_t>(k + 1)];
        if (q.joinPrev && p.tMs < t && q.tMs > t)
            return true;
    }
    return false;
}
} // namespace

float drawnStart(const DrawnLine& line) noexcept
{
    return line.count > 0 ? line.pts[0].tMs : 0.0f;
}

float drawnEnd(const DrawnLine& line) noexcept
{
    if (line.count == 0)
        return 0.0f;
    const auto& last = line.pts[static_cast<std::size_t>(line.count - 1)];
    return last.joinPrev ? last.tMs : last.tMs + kDotMs;
}

void drawnAt(const DrawnLine& line, float tMs, float& hz, float& amp) noexcept
{
    amp = 0.0f;
    if (line.count == 0)
    {
        hz = 2000.0f;
        return;
    }
    for (int a = 0; a < line.count;)
    {
        const int b = runEnd(line, a);
        const auto& first = line.pts[static_cast<std::size_t>(a)];
        const float start = first.tMs;
        const float end = a == b ? start + kDotMs : line.pts[static_cast<std::size_t>(b)].tMs;
        if (tMs < start)
        {
            hz = first.hz;
            return;
        }
        if (tMs <= end)
        {
            const float edge = std::max(1.0e-3f, std::min(kDrawEdgeMs, 0.5f * (end - start)));
            amp = std::clamp(std::min(tMs - start, end - tMs) / edge, 0.0f, 1.0f);
            hz = a == b ? first.hz : pitchIn(line, a, b, tMs);
            return;
        }
        a = b + 1;
    }
    hz = line.pts[static_cast<std::size_t>(line.count - 1)].hz;
}

bool addStroke(DrawnLine& line, const DrawnPoint* raw, int n, float pxPerMs, float pxPerHz, float tolPx)
{
    // Clean: inside the axis, time strictly rising.
    std::vector<DrawnPoint> s;
    s.reserve(static_cast<std::size_t>(std::max(0, n)));
    for (int i = 0; i < n; ++i)
    {
        DrawnPoint p = raw[i];
        p.tMs = std::max(0.0f, p.tMs);
        p.hz = std::clamp(p.hz, kDrawMinHz, kDrawMaxHz);
        if (s.empty() || p.tMs >= s.back().tMs + 1.0f)
            s.push_back(p);
    }
    if (s.empty())
        return true;

    // Ramer, Douglas and Peucker, without recursion.
    std::vector<bool> keep(s.size(), false);
    keep.front() = keep.back() = true;
    std::vector<std::pair<std::size_t, std::size_t>> stack;
    if (s.size() > 2)
        stack.emplace_back(0, s.size() - 1);
    while (! stack.empty())
    {
        const auto [i, j] = stack.back();
        stack.pop_back();
        const float x0 = s[i].tMs * pxPerMs, y0 = s[i].hz * pxPerHz;
        const float dx = s[j].tMs * pxPerMs - x0, dy = s[j].hz * pxPerHz - y0;
        const float len = std::max(1.0e-6f, std::sqrt(dx * dx + dy * dy));
        float worst = 0.0f;
        std::size_t at = i;
        for (std::size_t k = i + 1; k < j; ++k)
        {
            const float d = std::fabs((s[k].tMs * pxPerMs - x0) * dy - (s[k].hz * pxPerHz - y0) * dx) / len;
            if (d > worst)
            {
                worst = d;
                at = k;
            }
        }
        if (worst > tolPx)
        {
            keep[at] = true;
            if (at - i > 1) stack.emplace_back(i, at);
            if (j - at > 1) stack.emplace_back(at, j);
        }
    }
    std::vector<DrawnPoint> simple;
    for (std::size_t i = 0; i < s.size(); ++i)
        if (keep[i])
        {
            DrawnPoint p = s[i];
            p.joinPrev = ! simple.empty();
            simple.push_back(p);
        }

    const float t0 = simple.front().tMs;
    const float t1 = simple.size() == 1 ? t0 + kDotMs : simple.back().tMs;

    // What stays of the old line, cut cleanly at both ends of the stroke.
    std::vector<DrawnPoint> before, after;
    for (int i = 0; i < line.count; ++i)
    {
        const auto& p = line.pts[static_cast<std::size_t>(i)];
        if (p.tMs < t0)
            before.push_back(p);
        else if (p.tMs > t1)
            after.push_back(p);
    }
    float hz = 0.0f, amp = 0.0f;
    if (covered(line, t0 - 1.0f))
    {
        drawnAt(line, t0 - 1.0f, hz, amp);
        before.push_back(DrawnPoint { t0 - 1.0f, hz, true });
    }
    if (covered(line, t1 + 1.0f))
    {
        drawnAt(line, t1 + 1.0f, hz, amp);
        after.insert(after.begin(), DrawnPoint { t1 + 1.0f, hz, true });
    }
    if (! after.empty())
        after.front().joinPrev = false;

    const int room = DrawnLine::kMax - static_cast<int>(before.size() + after.size());
    if (room < 1)
        return false;
    const bool fits = static_cast<int>(simple.size()) <= room;
    if (! fits)
        simple.resize(static_cast<std::size_t>(room));

    int w = 0;
    for (const auto* part : { &before, &simple, &after })
        for (const auto& p : *part)
            line.pts[static_cast<std::size_t>(w++)] = p;
    line.count = w;
    line.pts[0].joinPrev = false;
    return fits;
}

bool eraseNear(DrawnLine& line, float tMs, float hz, float pxPerMs, float pxPerHz, float radiusPx)
{
    bool any = false;

    // The curve between two points: cut the join there.
    for (int k = 0; k + 1 < line.count; ++k)
    {
        auto& q = line.pts[static_cast<std::size_t>(k + 1)];
        if (! q.joinPrev || tMs <= line.pts[static_cast<std::size_t>(k)].tMs || tMs >= q.tMs)
            continue;
        float curveHz = 0.0f, amp = 0.0f;
        drawnAt(line, tMs, curveHz, amp);
        if (std::fabs(curveHz - hz) * pxPerHz <= radiusPx)
        {
            q.joinPrev = false;
            any = true;
        }
    }

    // Points.
    bool cut = false;
    int w = 0;
    const float r2 = radiusPx * radiusPx;
    for (int i = 0; i < line.count; ++i)
    {
        DrawnPoint p = line.pts[static_cast<std::size_t>(i)];
        const float dx = (p.tMs - tMs) * pxPerMs, dy = (p.hz - hz) * pxPerHz;
        if (dx * dx + dy * dy <= r2)
        {
            any = true;
            cut = true;
            continue;
        }
        if (cut)
        {
            p.joinPrev = false;
            cut = false;
        }
        line.pts[static_cast<std::size_t>(w++)] = p;
    }
    line.count = w;
    if (w > 0)
        line.pts[0].joinPrev = false;
    return any;
}
} // namespace tipp
