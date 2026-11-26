# No JUCE here. This library also builds to WebAssembly in M8.
add_library(tipp_core STATIC
    Engine.cpp
    Engine.h
    Params.h
    TestVoice.h)
target_include_directories(tipp_core PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
target_compile_features(tipp_core PUBLIC cxx_std_17)
target_link_libraries(tipp_core PRIVATE tipp_warnings)
