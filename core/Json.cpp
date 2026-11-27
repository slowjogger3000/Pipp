#include "Json.h"

#include <cstdlib>
#include <cstring>

namespace pipp::json
{
const Value* Value::get(const char* key) const noexcept
{
    if (type != Type::Object)
        return nullptr;
    for (std::size_t i = 0; i < keys.size(); ++i)
        if (keys[i] == key)
            return &items[i];
    return nullptr;
}

namespace
{
class Parser
{
public:
    explicit Parser(const std::string& s) : src(s) {}

    bool run(Value& out, std::string& error)
    {
        skipSpace();
        if (! value(out, 0))
        {
            error = message + " at byte " + std::to_string(pos);
            return false;
        }
        skipSpace();
        if (pos != src.size())
        {
            error = "trailing characters at byte " + std::to_string(pos);
            return false;
        }
        return true;
    }

private:
    const std::string& src;
    std::size_t pos = 0;
    std::string message;

    bool fail(const char* m)
    {
        message = m;
        return false;
    }

    char peek() const { return pos < src.size() ? src[pos] : '\0'; }

    void skipSpace()
    {
        while (pos < src.size() && (src[pos] == ' ' || src[pos] == '\t' || src[pos] == '\n' || src[pos] == '\r'))
            ++pos;
    }

    bool literal(const char* word)
    {
        const std::size_t n = std::strlen(word);
        if (src.compare(pos, n, word) != 0)
            return fail("unknown literal");
        pos += n;
        return true;
    }

    bool value(Value& v, int depth)
    {
        if (depth > 64)
            return fail("nesting too deep");

        switch (peek())
        {
            case '{': return object(v, depth);
            case '[': return array(v, depth);
            case '"': v.type = Value::Type::String; return string(v.text);
            case 't': v.type = Value::Type::Bool; v.boolean = true; return literal("true");
            case 'f': v.type = Value::Type::Bool; v.boolean = false; return literal("false");
            case 'n': v.type = Value::Type::Null; return literal("null");
            default: return number(v);
        }
    }

    bool number(Value& v)
    {
        const char* begin = src.c_str() + pos;
        char* end = nullptr;
        const double d = std::strtod(begin, &end);
        if (end == begin)
            return fail("expected a value");
        pos += static_cast<std::size_t>(end - begin);
        v.type = Value::Type::Number;
        v.number = d;
        return true;
    }

    static void appendUtf8(std::string& s, unsigned cp)
    {
        if (cp < 0x80u)
            s += static_cast<char>(cp);
        else if (cp < 0x800u)
        {
            s += static_cast<char>(0xc0u | (cp >> 6u));
            s += static_cast<char>(0x80u | (cp & 0x3fu));
        }
        else if (cp < 0x10000u)
        {
            s += static_cast<char>(0xe0u | (cp >> 12u));
            s += static_cast<char>(0x80u | ((cp >> 6u) & 0x3fu));
            s += static_cast<char>(0x80u | (cp & 0x3fu));
        }
        else
        {
            s += static_cast<char>(0xf0u | (cp >> 18u));
            s += static_cast<char>(0x80u | ((cp >> 12u) & 0x3fu));
            s += static_cast<char>(0x80u | ((cp >> 6u) & 0x3fu));
            s += static_cast<char>(0x80u | (cp & 0x3fu));
        }
    }

    bool hex4(unsigned& out)
    {
        if (pos + 4 > src.size())
            return fail("short \\u escape");
        out = 0u;
        for (int i = 0; i < 4; ++i)
        {
            const char c = src[pos++];
            out <<= 4u;
            if (c >= '0' && c <= '9')      out |= static_cast<unsigned>(c - '0');
            else if (c >= 'a' && c <= 'f') out |= static_cast<unsigned>(c - 'a' + 10);
            else if (c >= 'A' && c <= 'F') out |= static_cast<unsigned>(c - 'A' + 10);
            else return fail("bad \\u escape");
        }
        return true;
    }

    bool string(std::string& out)
    {
        ++pos; // opening quote
        out.clear();
        while (pos < src.size())
        {
            const char c = src[pos++];
            if (c == '"')
                return true;
            if (c != '\\')
            {
                out += c;
                continue;
            }
            if (pos >= src.size())
                break;
            const char e = src[pos++];
            switch (e)
            {
                case '"': out += '"'; break;
                case '\\': out += '\\'; break;
                case '/': out += '/'; break;
                case 'b': out += '\b'; break;
                case 'f': out += '\f'; break;
                case 'n': out += '\n'; break;
                case 'r': out += '\r'; break;
                case 't': out += '\t'; break;
                case 'u':
                {
                    unsigned cp = 0u;
                    if (! hex4(cp))
                        return false;
                    if (cp >= 0xd800u && cp < 0xdc00u && src.compare(pos, 2, "\\u") == 0)
                    {
                        pos += 2;
                        unsigned lo = 0u;
                        if (! hex4(lo))
                            return false;
                        cp = 0x10000u + ((cp - 0xd800u) << 10u) + (lo - 0xdc00u);
                    }
                    appendUtf8(out, cp);
                    break;
                }
                default: return fail("bad escape");
            }
        }
        return fail("unterminated string");
    }

    bool array(Value& v, int depth)
    {
        ++pos;
        v.type = Value::Type::Array;
        skipSpace();
        if (peek() == ']') { ++pos; return true; }
        for (;;)
        {
            skipSpace();
            v.items.emplace_back();
            if (! value(v.items.back(), depth + 1))
                return false;
            skipSpace();
            if (peek() == ',') { ++pos; continue; }
            if (peek() == ']') { ++pos; return true; }
            return fail("expected , or ]");
        }
    }

    bool object(Value& v, int depth)
    {
        ++pos;
        v.type = Value::Type::Object;
        skipSpace();
        if (peek() == '}') { ++pos; return true; }
        for (;;)
        {
            skipSpace();
            if (peek() != '"')
                return fail("expected a key");
            v.keys.emplace_back();
            if (! string(v.keys.back()))
                return false;
            skipSpace();
            if (peek() != ':')
                return fail("expected :");
            ++pos;
            skipSpace();
            v.items.emplace_back();
            if (! value(v.items.back(), depth + 1))
                return false;
            skipSpace();
            if (peek() == ',') { ++pos; continue; }
            if (peek() == '}') { ++pos; return true; }
            return fail("expected , or }");
        }
    }
};
} // namespace

bool parse(const std::string& source, Value& out, std::string& error)
{
    out = Value {};
    Parser p(source);
    return p.run(out, error);
}
} // namespace pipp::json
