#pragma once

// A small JSON reader for bird data. Parses text the host hands over; it
// reads no files. Allocates, so never call it on the audio thread.

#include <string>
#include <vector>

namespace tipp::json
{
struct Value
{
    enum class Type { Null, Bool, Number, String, Array, Object };

    Type type = Type::Null;
    bool boolean = false;
    double number = 0.0;
    std::string text;
    std::vector<Value> items;      // Array items, or Object values
    std::vector<std::string> keys; // Object keys, parallel to items

    bool isNumber() const noexcept { return type == Type::Number; }
    bool isString() const noexcept { return type == Type::String; }
    bool isArray() const noexcept { return type == Type::Array; }
    bool isObject() const noexcept { return type == Type::Object; }
    bool isBool() const noexcept { return type == Type::Bool; }

    // Object member, or nullptr.
    const Value* get(const char* key) const noexcept;
};

// Returns false and fills error (with a byte offset) on bad input.
bool parse(const std::string& source, Value& out, std::string& error);
} // namespace tipp::json
