add_executable(pipp-render main.cpp WavWriter.h)
target_link_libraries(pipp-render PRIVATE pipp_core pipp_warnings)
