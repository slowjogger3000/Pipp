# No JUCE here. This library also builds to WebAssembly in M8.
add_library(tipp_core STATIC
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
    Json.cpp
    Json.h
    Params.h
    Quiz.cpp
    Quiz.h
    Random.h
    Surroundings.cpp
    Surroundings.h
    Syrinx.h)
target_include_directories(tipp_core PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
target_compile_features(tipp_core PUBLIC cxx_std_17)
target_link_libraries(tipp_core PRIVATE tipp_warnings)
