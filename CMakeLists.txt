cmake_minimum_required(VERSION 3.22)
project(Tipp VERSION 0.1.0 LANGUAGES C CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_OSX_DEPLOYMENT_TARGET "11.0" CACHE STRING "")

# Executables land in build/<Config>/ with the Xcode generator.
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})

# Strict warnings for project files only. JUCE gets its own flags.
add_library(tipp_warnings INTERFACE)
target_compile_options(tipp_warnings INTERFACE
    -Wall -Wextra -Wpedantic -Wshadow -Wconversion -Wsign-conversion
    -Wdouble-promotion -Wnon-virtual-dtor -Wold-style-cast)

add_subdirectory(core)
add_subdirectory(tools/render)

option(TIPP_BUILD_STANDALONE "Build the JUCE standalone app (fetches JUCE)" OFF)
if(TIPP_BUILD_STANDALONE)
    add_subdirectory(standalone)
endif()
