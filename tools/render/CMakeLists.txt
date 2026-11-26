add_executable(tipp-render main.cpp WavWriter.h)
target_link_libraries(tipp-render PRIVATE tipp_core tipp_warnings)
