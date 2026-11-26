# JUCE standalone. Pinned to 9.0.6, the latest tag on 2026-11-26.
# Read JUCE's BREAKING_CHANGES.md before moving the pin.
# Pass -DJUCE_DIR=/path/to/JUCE to use a local checkout instead.

if(DEFINED JUCE_DIR)
    add_subdirectory(${JUCE_DIR} JUCE)
else()
    include(FetchContent)
    FetchContent_Declare(JUCE
        GIT_REPOSITORY https://github.com/juce-framework/JUCE.git
        GIT_TAG 9.0.6
        GIT_SHALLOW ON)
    FetchContent_MakeAvailable(JUCE)
endif()

juce_add_gui_app(Tipp
    PRODUCT_NAME "Tipp"
    COMPANY_NAME "Skisse"
    BUNDLE_ID com.skisse.tipp
    VERSION ${PROJECT_VERSION})

target_sources(Tipp PRIVATE Source/Main.cpp)

target_compile_definitions(Tipp PRIVATE
    JUCE_WEB_BROWSER=0
    JUCE_USE_CURL=0
    TIPP_DATA_DIR="${CMAKE_SOURCE_DIR}/data"
    JUCE_APPLICATION_NAME_STRING="$<TARGET_PROPERTY:Tipp,JUCE_PRODUCT_NAME>"
    JUCE_APPLICATION_VERSION_STRING="$<TARGET_PROPERTY:Tipp,JUCE_VERSION>")

target_link_libraries(Tipp
    PRIVATE
        tipp_core
        juce::juce_audio_utils
    PUBLIC
        juce::juce_recommended_config_flags
        juce::juce_recommended_lto_flags
        juce::juce_recommended_warning_flags)
