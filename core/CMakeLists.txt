# No JUCE here. This library also builds to WebAssembly in M8.
add_library(pipp_core STATIC
    BirdData.cpp
    BirdData.h
    Chorus.cpp
    Chorus.h
    Compare.cpp
    Compare.h
    Drawn.cpp
    Drawn.h
    Engine.cpp
    Engine.h
    Exact.h
    Json.cpp
    Json.h
    Params.h
    Quiz.cpp
    Quiz.h
    Random.h
    Surroundings.cpp
    Surroundings.h
    Syrinx.h)
target_include_directories(pipp_core PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
target_compile_features(pipp_core PUBLIC cxx_std_17)
target_link_libraries(pipp_core PRIVATE pipp_warnings)
# Same bits native and in WebAssembly: no fused multiply-add (see Exact.h).
target_compile_options(pipp_core PRIVATE -ffp-contract=off)
