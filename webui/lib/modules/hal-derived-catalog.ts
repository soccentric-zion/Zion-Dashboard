import type { ExecutionMode, ModuleInfo } from "@/lib/types/api";

export interface HalModuleCatalogEntry extends ModuleInfo {
  source_path: string;
  modes: ExecutionMode[];
  tests: Array<{
    id: string;
    name: string;
    description: string;
    modes: ExecutionMode[];
  }>;
}

export const HAL_MODULE_CATALOG = [
  {
    "id": "audio_interfaces",
    "name": "Audio Interfaces",
    "description": "Audio Interfaces HAL validation module from src/audio_interfaces/audio_interfaces.h.",
    "version": "1",
    "category": "media",
    "result_type_url": "type.googleapis.com/hal.modules.audio_interfaces.Result",
    "config_type_url": "type.googleapis.com/hal.modules.audio_interfaces.Config",
    "source_path": "src/audio_interfaces/audio_interfaces.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testAudioBitDepths",
        "name": "Audio Bit Depths",
        "description": "HAL test case testAudioBitDepths from the Audio Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testAudioDmaTransfers",
        "name": "Audio Dma Transfers",
        "description": "HAL test case testAudioDmaTransfers from the Audio Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testAudioInput",
        "name": "Audio Input",
        "description": "HAL test case testAudioInput from the Audio Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testAudioLatency",
        "name": "Audio Latency",
        "description": "HAL test case testAudioLatency from the Audio Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testAudioOutput",
        "name": "Audio Output",
        "description": "HAL test case testAudioOutput from the Audio Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testAudioSampleRates",
        "name": "Audio Sample Rates",
        "description": "HAL test case testAudioSampleRates from the Audio Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testI2sInterface",
        "name": "I2s Interface",
        "description": "HAL test case testI2sInterface from the Audio Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMultiChannelAudio",
        "name": "Multi Channel Audio",
        "description": "HAL test case testMultiChannelAudio from the Audio Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "camera_interfaces",
    "name": "Camera Interfaces",
    "description": "Camera Interfaces HAL validation module from src/camera_interfaces_lib/camera_interfaces_lib.h.",
    "version": "1",
    "category": "media",
    "result_type_url": "type.googleapis.com/hal.modules.camera_interfaces.Result",
    "config_type_url": "type.googleapis.com/hal.modules.camera_interfaces.Config",
    "source_path": "src/camera_interfaces_lib/camera_interfaces_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testAllCsi2LanesFunctionality",
        "name": "All Csi2 Lanes Functionality",
        "description": "HAL test case testAllCsi2LanesFunctionality from the Camera Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testAutoExposure",
        "name": "Auto Exposure",
        "description": "HAL test case testAutoExposure from the Camera Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testAutoFocus",
        "name": "Auto Focus",
        "description": "HAL test case testAutoFocus from the Camera Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testAutoWhiteBalance",
        "name": "Auto White Balance",
        "description": "HAL test case testAutoWhiteBalance from the Camera Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCameraClockGeneration",
        "name": "Camera Clock Generation",
        "description": "HAL test case testCameraClockGeneration from the Camera Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCameraPowerSequencing",
        "name": "Camera Power Sequencing",
        "description": "HAL test case testCameraPowerSequencing from the Camera Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testColorCorrectionMatrix",
        "name": "Color Correction Matrix",
        "description": "HAL test case testColorCorrectionMatrix from the Camera Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCsi2CphyOperation",
        "name": "Csi2 Cphy Operation",
        "description": "HAL test case testCsi2CphyOperation from the Camera Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCsi2DphyOperation",
        "name": "Csi2 Dphy Operation",
        "description": "HAL test case testCsi2DphyOperation from the Camera Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDemosaicing",
        "name": "Demosaicing",
        "description": "HAL test case testDemosaicing from the Camera Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testEdgeEnhancement",
        "name": "Edge Enhancement",
        "description": "HAL test case testEdgeEnhancement from the Camera Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGammaCorrection",
        "name": "Gamma Correction",
        "description": "HAL test case testGammaCorrection from the Camera Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testIspPipelineProcessing",
        "name": "Isp Pipeline Processing",
        "description": "HAL test case testIspPipelineProcessing from the Camera Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testLensShadingCorrection",
        "name": "Lens Shading Correction",
        "description": "HAL test case testLensShadingCorrection from the Camera Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMultipleCameraSimultaneousOperation",
        "name": "Multiple Camera Simultaneous Operation",
        "description": "HAL test case testMultipleCameraSimultaneousOperation from the Camera Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testNoiseReduction",
        "name": "Noise Reduction",
        "description": "HAL test case testNoiseReduction from the Camera Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testRaw10",
        "name": "Raw10",
        "description": "HAL test case testRaw10 from the Camera Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testRaw12",
        "name": "Raw12",
        "description": "HAL test case testRaw12 from the Camera Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testRaw14",
        "name": "Raw14",
        "description": "HAL test case testRaw14 from the Camera Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testRaw8",
        "name": "Raw8",
        "description": "HAL test case testRaw8 from the Camera Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testRgbFormats",
        "name": "Rgb Formats",
        "description": "HAL test case testRgbFormats from the Camera Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testVirtualChannelSupport",
        "name": "Virtual Channel Support",
        "description": "HAL test case testVirtualChannelSupport from the Camera Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testYuv422",
        "name": "Yuv422",
        "description": "HAL test case testYuv422 from the Camera Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "camera_module3",
    "name": "Camera Module3",
    "description": "Camera Module3 HAL validation module from src/camera_module3_lib/camera_module3_lib.h.",
    "version": "1",
    "category": "media",
    "result_type_url": "type.googleapis.com/hal.modules.camera_module3.Result",
    "config_type_url": "type.googleapis.com/hal.modules.camera_module3.Config",
    "source_path": "src/camera_module3_lib/camera_module3_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testAutofocus",
        "name": "Autofocus",
        "description": "HAL test case testAutofocus from the Camera Module3 module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCameraDetection",
        "name": "Camera Detection",
        "description": "HAL test case testCameraDetection from the Camera Module3 module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testHdrMode",
        "name": "Hdr Mode",
        "description": "HAL test case testHdrMode from the Camera Module3 module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMipiCsiInterface",
        "name": "Mipi Csi Interface",
        "description": "HAL test case testMipiCsiInterface from the Camera Module3 module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPixelFormats",
        "name": "Pixel Formats",
        "description": "HAL test case testPixelFormats from the Camera Module3 module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSensorResolution",
        "name": "Sensor Resolution",
        "description": "HAL test case testSensorResolution from the Camera Module3 module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testStillCapture",
        "name": "Still Capture",
        "description": "HAL test case testStillCapture from the Camera Module3 module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testVideoStreaming",
        "name": "Video Streaming",
        "description": "HAL test case testVideoStreaming from the Camera Module3 module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "clock_and_timing",
    "name": "Clock And Timing",
    "description": "Clock And Timing HAL validation module from src/clock_and_timing_lib/clock_and_timing_lib.h.",
    "version": "1",
    "category": "timing",
    "result_type_url": "type.googleapis.com/hal.modules.clock_and_timing.Result",
    "config_type_url": "type.googleapis.com/hal.modules.clock_and_timing.Config",
    "source_path": "src/clock_and_timing_lib/clock_and_timing_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testAudioClock",
        "name": "Audio Clock",
        "description": "HAL test case testAudioClock from the Clock And Timing module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCameraClockOutput",
        "name": "Camera Clock Output",
        "description": "HAL test case testCameraClockOutput from the Clock And Timing module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testClockJitterMeasurements",
        "name": "Clock Jitter Measurements",
        "description": "HAL test case testClockJitterMeasurements from the Clock And Timing module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testEthernetReferenceClock",
        "name": "Ethernet Reference Clock",
        "description": "HAL test case testEthernetReferenceClock from the Clock And Timing module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPcieReferenceClock",
        "name": "Pcie Reference Clock",
        "description": "HAL test case testPcieReferenceClock from the Clock And Timing module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPllLockStatus",
        "name": "Pll Lock Status",
        "description": "HAL test case testPllLockStatus from the Clock And Timing module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testRtcAccuracy",
        "name": "Rtc Accuracy",
        "description": "HAL test case testRtcAccuracy from the Clock And Timing module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testRtcAlarmFunctionality",
        "name": "Rtc Alarm Functionality",
        "description": "HAL test case testRtcAlarmFunctionality from the Clock And Timing module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testRtcBatteryBackup",
        "name": "Rtc Battery Backup",
        "description": "HAL test case testRtcBatteryBackup from the Clock And Timing module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testRtcTimePersistence",
        "name": "Rtc Time Persistence",
        "description": "HAL test case testRtcTimePersistence from the Clock And Timing module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSystemClockAccuracy",
        "name": "System Clock Accuracy",
        "description": "HAL test case testSystemClockAccuracy from the Clock And Timing module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testUsbReferenceClock",
        "name": "Usb Reference Clock",
        "description": "HAL test case testUsbReferenceClock from the Clock And Timing module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "communication_interface",
    "name": "Communication Interface",
    "description": "Communication Interface HAL validation module from src/communication_interface_lib/communication_interface_lib.h.",
    "version": "1",
    "category": "serial_bus",
    "result_type_url": "type.googleapis.com/hal.modules.communication_interface.Result",
    "config_type_url": "type.googleapis.com/hal.modules.communication_interface.Config",
    "source_path": "src/communication_interface_lib/communication_interface_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testAllI2cBuses",
        "name": "All I2c Buses",
        "description": "HAL test case testAllI2cBuses from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testAllSpiControllers",
        "name": "All Spi Controllers",
        "description": "HAL test case testAllSpiControllers from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testAllUartPortsFunctionality",
        "name": "All Uart Ports Functionality",
        "description": "HAL test case testAllUartPortsFunctionality from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCan20a",
        "name": "Can20a",
        "description": "HAL test case testCan20a from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCan20b",
        "name": "Can20b",
        "description": "HAL test case testCan20b from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCanBusoffRecovery",
        "name": "Can Busoff Recovery",
        "description": "HAL test case testCanBusoffRecovery from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCanErrorDetection",
        "name": "Can Error Detection",
        "description": "HAL test case testCanErrorDetection from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCanFd",
        "name": "Can Fd",
        "description": "HAL test case testCanFd from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCanMessageFiltering",
        "name": "Can Message Filtering",
        "description": "HAL test case testCanMessageFiltering from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testChipSelectFunctionality",
        "name": "Chip Select Functionality",
        "description": "HAL test case testChipSelectFunctionality from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testConsoledebugUart",
        "name": "Consoledebug Uart",
        "description": "HAL test case testConsoledebugUart from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testFastMode",
        "name": "Fast Mode",
        "description": "HAL test case testFastMode from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testFastModePlus",
        "name": "Fast Mode Plus",
        "description": "HAL test case testFastModePlus from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testHardwareFlowControl",
        "name": "Hardware Flow Control",
        "description": "HAL test case testHardwareFlowControl from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testHighspeedMode",
        "name": "Highspeed Mode",
        "description": "HAL test case testHighspeedMode from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testI2cClockStretching",
        "name": "I2c Clock Stretching",
        "description": "HAL test case testI2cClockStretching from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testI2cMasterMode",
        "name": "I2c Master Mode",
        "description": "HAL test case testI2cMasterMode from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testI2cRepeatedStart",
        "name": "I2c Repeated Start",
        "description": "HAL test case testI2cRepeatedStart from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testI2cSlaveMode",
        "name": "I2c Slave Mode",
        "description": "HAL test case testI2cSlaveMode from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMultimasterArbitration",
        "name": "Multimaster Arbitration",
        "description": "HAL test case testMultimasterArbitration from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMultipleSpiDevices",
        "name": "Multiple Spi Devices",
        "description": "HAL test case testMultipleSpiDevices from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testParityChecking",
        "name": "Parity Checking",
        "description": "HAL test case testParityChecking from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSpiDmaTransfers",
        "name": "Spi Dma Transfers",
        "description": "HAL test case testSpiDmaTransfers from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSpiMasterMode",
        "name": "Spi Master Mode",
        "description": "HAL test case testSpiMasterMode from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSpiModes",
        "name": "Spi Modes",
        "description": "HAL test case testSpiModes from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSpiSlaveMode",
        "name": "Spi Slave Mode",
        "description": "HAL test case testSpiSlaveMode from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testStandardMode",
        "name": "Standard Mode",
        "description": "HAL test case testStandardMode from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testStopBitConfiguration",
        "name": "Stop Bit Configuration",
        "description": "HAL test case testStopBitConfiguration from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testUartDmaOperation",
        "name": "Uart Dma Operation",
        "description": "HAL test case testUartDmaOperation from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testUartInterruptHandling",
        "name": "Uart Interrupt Handling",
        "description": "HAL test case testUartInterruptHandling from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testVariousBaudRates",
        "name": "Various Baud Rates",
        "description": "HAL test case testVariousBaudRates from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testVariousCanBitrates",
        "name": "Various Can Bitrates",
        "description": "HAL test case testVariousCanBitrates from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testVariousSpiClockSpeeds",
        "name": "Various Spi Clock Speeds",
        "description": "HAL test case testVariousSpiClockSpeeds from the Communication Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "cpu",
    "name": "CPU",
    "description": "CPU HAL validation module from src/cpu_lib/cpu_lib.h.",
    "version": "1",
    "category": "compute",
    "result_type_url": "type.googleapis.com/hal.modules.cpu.Result",
    "config_type_url": "type.googleapis.com/hal.modules.cpu.Config",
    "source_path": "src/cpu_lib/cpu_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testAll12CpuCoresFunctionality",
        "name": "All12 Cpu Cores Functionality",
        "description": "HAL test case testAll12CpuCoresFunctionality from the CPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCacheBandwidthAndLatency",
        "name": "Cache Bandwidth And Latency",
        "description": "HAL test case testCacheBandwidthAndLatency from the CPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCacheCoherencyBetweenClusters",
        "name": "Cache Coherency Between Clusters",
        "description": "HAL test case testCacheCoherencyBetweenClusters from the CPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCacheLineInvalidation",
        "name": "Cache Line Invalidation",
        "description": "HAL test case testCacheLineInvalidation from the CPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testContextSwitchingPerformance",
        "name": "Context Switching Performance",
        "description": "HAL test case testContextSwitchingPerformance from the CPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCoreAffinityAndThreadMigration",
        "name": "Core Affinity And Thread Migration",
        "description": "HAL test case testCoreAffinityAndThreadMigration from the CPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCpuClusterCommunication",
        "name": "Cpu Cluster Communication",
        "description": "HAL test case testCpuClusterCommunication from the CPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCpuCoreFrequencyScaling",
        "name": "Cpu Core Frequency Scaling",
        "description": "HAL test case testCpuCoreFrequencyScaling from the CPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCpuPowerStatesAndTransitions",
        "name": "Cpu Power States And Transitions",
        "description": "HAL test case testCpuPowerStatesAndTransitions from the CPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCpuThermalThrottling",
        "name": "Cpu Thermal Throttling",
        "description": "HAL test case testCpuThermalThrottling from the CPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDmaOperations",
        "name": "Dma Operations",
        "description": "HAL test case testDmaOperations from the CPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testIndividualCoreStressTesting",
        "name": "Individual Core Stress Testing",
        "description": "HAL test case testIndividualCoreStressTesting from the CPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testInterruptLatency",
        "name": "Interrupt Latency",
        "description": "HAL test case testInterruptLatency from the CPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testL1Cache",
        "name": "L1 Cache",
        "description": "HAL test case testL1Cache from the CPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testL2Cache",
        "name": "L2 Cache",
        "description": "HAL test case testL2Cache from the CPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testL3Cache",
        "name": "L3 Cache",
        "description": "HAL test case testL3Cache from the CPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMulticoreSynchronization",
        "name": "Multicore Synchronization",
        "description": "HAL test case testMulticoreSynchronization from the CPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMultithreadedPerformance",
        "name": "Multithreaded Performance",
        "description": "HAL test case testMultithreadedPerformance from the CPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSinglethreadedPerformance",
        "name": "Singlethreaded Performance",
        "description": "HAL test case testSinglethreadedPerformance from the CPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSystemCache",
        "name": "System Cache",
        "description": "HAL test case testSystemCache from the CPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "debug_and_development_interfaces",
    "name": "Debug And Development Interfaces",
    "description": "Debug And Development Interfaces HAL validation module from src/debug_and_development_interfaces/debug_and_development_interfaces.h.",
    "version": "1",
    "category": "system",
    "result_type_url": "type.googleapis.com/hal.modules.debug_and_development_interfaces.Result",
    "config_type_url": "type.googleapis.com/hal.modules.debug_and_development_interfaces.Config",
    "source_path": "src/debug_and_development_interfaces/debug_and_development_interfaces.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testDebugAuthentication",
        "name": "Debug Authentication",
        "description": "HAL test case testDebugAuthentication from the Debug And Development Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDebugUart",
        "name": "Debug Uart",
        "description": "HAL test case testDebugUart from the Debug And Development Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testJtagInterface",
        "name": "Jtag Interface",
        "description": "HAL test case testJtagInterface from the Debug And Development Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPerformanceCounters",
        "name": "Performance Counters",
        "description": "HAL test case testPerformanceCounters from the Debug And Development Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSerialWireDebug",
        "name": "Serial Wire Debug",
        "description": "HAL test case testSerialWireDebug from the Debug And Development Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testTracePort",
        "name": "Trace Port",
        "description": "HAL test case testTracePort from the Debug And Development Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "deep_learning_accelerator",
    "name": "Deep Learning Accelerator",
    "description": "Deep Learning Accelerator HAL validation module from src/deep_learning_accelerator_lib/deep_learning_accelerator_lib.h.",
    "version": "1",
    "category": "compute",
    "result_type_url": "type.googleapis.com/hal.modules.deep_learning_accelerator.Result",
    "config_type_url": "type.googleapis.com/hal.modules.deep_learning_accelerator.Config",
    "source_path": "src/deep_learning_accelerator_lib/deep_learning_accelerator_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testActivationFunctions",
        "name": "Activation Functions",
        "description": "HAL test case testActivationFunctions from the Deep Learning Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testBatchNormalization",
        "name": "Batch Normalization",
        "description": "HAL test case testBatchNormalization from the Deep Learning Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testConvolutionOperations",
        "name": "Convolution Operations",
        "description": "HAL test case testConvolutionOperations from the Deep Learning Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDeconvolutionOperations",
        "name": "Deconvolution Operations",
        "description": "HAL test case testDeconvolutionOperations from the Deep Learning Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDla1Functionality",
        "name": "Dla1 Functionality",
        "description": "HAL test case testDla1Functionality from the Deep Learning Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDla2Functionality",
        "name": "Dla2 Functionality",
        "description": "HAL test case testDla2Functionality from the Deep Learning Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDlaClockFrequency",
        "name": "Dla Clock Frequency",
        "description": "HAL test case testDlaClockFrequency from the Deep Learning Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDlaLatencyMeasurements",
        "name": "Dla Latency Measurements",
        "description": "HAL test case testDlaLatencyMeasurements from the Deep Learning Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDlaMemoryBandwidth",
        "name": "Dla Memory Bandwidth",
        "description": "HAL test case testDlaMemoryBandwidth from the Deep Learning Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDlaPowerConsumption",
        "name": "Dla Power Consumption",
        "description": "HAL test case testDlaPowerConsumption from the Deep Learning Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDlaThermalBehavior",
        "name": "Dla Thermal Behavior",
        "description": "HAL test case testDlaThermalBehavior from the Deep Learning Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDlaThroughputTesting",
        "name": "Dla Throughput Testing",
        "description": "HAL test case testDlaThroughputTesting from the Deep Learning Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDlaTopsVerification",
        "name": "Dla Tops Verification",
        "description": "HAL test case testDlaTopsVerification from the Deep Learning Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDualDlaConcurrentOperation",
        "name": "Dual Dla Concurrent Operation",
        "description": "HAL test case testDualDlaConcurrentOperation from the Deep Learning Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testElementwiseOperations",
        "name": "Elementwise Operations",
        "description": "HAL test case testElementwiseOperations from the Deep Learning Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testFp16Precision",
        "name": "Fp16 Precision",
        "description": "HAL test case testFp16Precision from the Deep Learning Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testFullyConnectedLayers",
        "name": "Fully Connected Layers",
        "description": "HAL test case testFullyConnectedLayers from the Deep Learning Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testHardwareSchedulerOperation",
        "name": "Hardware Scheduler Operation",
        "description": "HAL test case testHardwareSchedulerOperation from the Deep Learning Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testInt8Precision",
        "name": "Int8 Precision",
        "description": "HAL test case testInt8Precision from the Deep Learning Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPoolingOperations",
        "name": "Pooling Operations",
        "description": "HAL test case testPoolingOperations from the Deep Learning Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testStructuredSparsitySupport",
        "name": "Structured Sparsity Support",
        "description": "HAL test case testStructuredSparsitySupport from the Deep Learning Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "display_interfaces",
    "name": "Display Interfaces",
    "description": "Display Interfaces HAL validation module from src/display_interfaces/display_interfaces.h.",
    "version": "1",
    "category": "media",
    "result_type_url": "type.googleapis.com/hal.modules.display_interfaces.Result",
    "config_type_url": "type.googleapis.com/hal.modules.display_interfaces.Config",
    "source_path": "src/display_interfaces/display_interfaces.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testDisplayHotPlugDetection",
        "name": "Display Hot Plug Detection",
        "description": "HAL test case testDisplayHotPlugDetection from the Display Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDisplayPortOutput",
        "name": "Display Port Output",
        "description": "HAL test case testDisplayPortOutput from the Display Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testHdmiOutput",
        "name": "Hdmi Output",
        "description": "HAL test case testHdmiOutput from the Display Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testHdrSupport",
        "name": "Hdr Support",
        "description": "HAL test case testHdrSupport from the Display Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMultiDisplaySupport",
        "name": "Multi Display Support",
        "description": "HAL test case testMultiDisplaySupport from the Display Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testVariousRefreshRates",
        "name": "Various Refresh Rates",
        "description": "HAL test case testVariousRefreshRates from the Display Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testVariousResolutions",
        "name": "Various Resolutions",
        "description": "HAL test case testVariousResolutions from the Display Interfaces module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "environmental",
    "name": "Environmental",
    "description": "Environmental HAL validation module from src/environmental_lib/environmental_lib.h.",
    "version": "1",
    "category": "sensors",
    "result_type_url": "type.googleapis.com/hal.modules.environmental.Result",
    "config_type_url": "type.googleapis.com/hal.modules.environmental.Config",
    "source_path": "src/environmental_lib/environmental_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testEmiemcCompliance",
        "name": "Emiemc Compliance",
        "description": "HAL test case testEmiemcCompliance from the Environmental module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testEsdProtection",
        "name": "Esd Protection",
        "description": "HAL test case testEsdProtection from the Environmental module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testHumidityResistance",
        "name": "Humidity Resistance",
        "description": "HAL test case testHumidityResistance from the Environmental module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSaltSprayResistance",
        "name": "Salt Spray Resistance",
        "description": "HAL test case testSaltSprayResistance from the Environmental module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testShockResistance",
        "name": "Shock Resistance",
        "description": "HAL test case testShockResistance from the Environmental module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testTemperatureRange",
        "name": "Temperature Range",
        "description": "HAL test case testTemperatureRange from the Environmental module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testVibrationResistance",
        "name": "Vibration Resistance",
        "description": "HAL test case testVibrationResistance from the Environmental module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "ethernet",
    "name": "Ethernet",
    "description": "Ethernet HAL validation module from src/ethernet_lib/ethernet_lib.h.",
    "version": "1",
    "category": "networking",
    "result_type_url": "type.googleapis.com/hal.modules.ethernet.Result",
    "config_type_url": "type.googleapis.com/hal.modules.ethernet.Config",
    "source_path": "src/ethernet_lib/ethernet_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "test10GigabitLinkEstablishment",
        "name": "10 Gigabit Link Establishment",
        "description": "HAL test case test10GigabitLinkEstablishment from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "test10gbeReceiveThroughput",
        "name": "10gbe Receive Throughput",
        "description": "HAL test case test10gbeReceiveThroughput from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "test10gbeTransmitThroughput",
        "name": "10gbe Transmit Throughput",
        "description": "HAL test case test10gbeTransmitThroughput from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "test1gPhyFunctionality",
        "name": "1g Phy Functionality",
        "description": "HAL test case test1gPhyFunctionality from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testAutomdimdix",
        "name": "Automdimdix",
        "description": "HAL test case testAutomdimdix from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testChecksumOffload",
        "name": "Checksum Offload",
        "description": "HAL test case testChecksumOffload from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testEthernetCableDiagnostics",
        "name": "Ethernet Cable Diagnostics",
        "description": "HAL test case testEthernetCableDiagnostics from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testFlowControl",
        "name": "Flow Control",
        "description": "HAL test case testFlowControl from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testFullduplexOperation",
        "name": "Fullduplex Operation",
        "description": "HAL test case testFullduplexOperation from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testIeee8021asTimeSynchronization",
        "name": "Ieee8021as Time Synchronization",
        "description": "HAL test case testIeee8021asTimeSynchronization from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testIeee8021qav",
        "name": "Ieee8021qav",
        "description": "HAL test case testIeee8021qav from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testIeee8021qbu",
        "name": "Ieee8021qbu",
        "description": "HAL test case testIeee8021qbu from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testIeee8021qbv",
        "name": "Ieee8021qbv",
        "description": "HAL test case testIeee8021qbv from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testJumboFramesSupport",
        "name": "Jumbo Frames Support",
        "description": "HAL test case testJumboFramesSupport from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testLinkSpeedNegotiation",
        "name": "Link Speed Negotiation",
        "description": "HAL test case testLinkSpeedNegotiation from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testRedundantSwitchOperation",
        "name": "Redundant Switch Operation",
        "description": "HAL test case testRedundantSwitchOperation from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSwitchFailover",
        "name": "Switch Failover",
        "description": "HAL test case testSwitchFailover from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSwitchForwardingTable",
        "name": "Switch Forwarding Table",
        "description": "HAL test case testSwitchForwardingTable from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSwitchPortFunctionality",
        "name": "Switch Port Functionality",
        "description": "HAL test case testSwitchPortFunctionality from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSwitchPortMirroring",
        "name": "Switch Port Mirroring",
        "description": "HAL test case testSwitchPortMirroring from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSwitchQos",
        "name": "Switch Qos",
        "description": "HAL test case testSwitchQos from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSwitchStatistics",
        "name": "Switch Statistics",
        "description": "HAL test case testSwitchStatistics from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSwitchVlanSupport",
        "name": "Switch Vlan Support",
        "description": "HAL test case testSwitchVlanSupport from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testTsnLatencyGuarantees",
        "name": "Tsn Latency Guarantees",
        "description": "HAL test case testTsnLatencyGuarantees from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testTsnTimePrecision",
        "name": "Tsn Time Precision",
        "description": "HAL test case testTsnTimePrecision from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testTsnTrafficScheduling",
        "name": "Tsn Traffic Scheduling",
        "description": "HAL test case testTsnTrafficScheduling from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testVlanTagging",
        "name": "Vlan Tagging",
        "description": "HAL test case testVlanTagging from the Ethernet module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "ethernet_switch",
    "name": "Ethernet Switch",
    "description": "Ethernet Switch HAL validation module from src/ethernet_switch_lib/ethernet_switch_lib.h.",
    "version": "1",
    "category": "networking",
    "result_type_url": "type.googleapis.com/hal.modules.ethernet_switch.Result",
    "config_type_url": "type.googleapis.com/hal.modules.ethernet_switch.Config",
    "source_path": "src/ethernet_switch_lib/ethernet_switch_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testRedundantSwitchOperation",
        "name": "Redundant Switch Operation",
        "description": "HAL test case testRedundantSwitchOperation from the Ethernet Switch module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSwitchFailover",
        "name": "Switch Failover",
        "description": "HAL test case testSwitchFailover from the Ethernet Switch module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSwitchForwardingTable",
        "name": "Switch Forwarding Table",
        "description": "HAL test case testSwitchForwardingTable from the Ethernet Switch module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSwitchPortFunctionality",
        "name": "Switch Port Functionality",
        "description": "HAL test case testSwitchPortFunctionality from the Ethernet Switch module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSwitchPortMirroring",
        "name": "Switch Port Mirroring",
        "description": "HAL test case testSwitchPortMirroring from the Ethernet Switch module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSwitchQos",
        "name": "Switch Qos",
        "description": "HAL test case testSwitchQos from the Ethernet Switch module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSwitchStatistics",
        "name": "Switch Statistics",
        "description": "HAL test case testSwitchStatistics from the Ethernet Switch module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSwitchVlanSupport",
        "name": "Switch Vlan Support",
        "description": "HAL test case testSwitchVlanSupport from the Ethernet Switch module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "external_connector",
    "name": "External Connector",
    "description": "External Connector HAL validation module from src/external_connector_lib/external_connector_lib.h.",
    "version": "1",
    "category": "high_speed",
    "result_type_url": "type.googleapis.com/hal.modules.external_connector.Result",
    "config_type_url": "type.googleapis.com/hal.modules.external_connector.Config",
    "source_path": "src/external_connector_lib/external_connector_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "test12vAsilQsRPower",
        "name": "12v Asil Qs R Power",
        "description": "HAL test case test12vAsilQsRPower from the External Connector module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testAdenlrSignals",
        "name": "Adenlr Signals",
        "description": "HAL test case testAdenlrSignals from the External Connector module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testAllConnectorPinAssignments",
        "name": "All Connector Pin Assignments",
        "description": "HAL test case testAllConnectorPinAssignments from the External Connector module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testAllConnectorPinsContinuity",
        "name": "All Connector Pins Continuity",
        "description": "HAL test case testAllConnectorPinsContinuity from the External Connector module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testAllEthernetPhyConnections",
        "name": "All Ethernet Phy Connections",
        "description": "HAL test case testAllEthernetPhyConnections from the External Connector module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testBcmCanInterface",
        "name": "Bcm Can Interface",
        "description": "HAL test case testBcmCanInterface from the External Connector module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCc1j709",
        "name": "Cc1j709",
        "description": "HAL test case testCc1j709 from the External Connector module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCc2j710",
        "name": "Cc2j710",
        "description": "HAL test case testCc2j710 from the External Connector module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCc3j711",
        "name": "Cc3j711",
        "description": "HAL test case testCc3j711 from the External Connector module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCc4j712",
        "name": "Cc4j712",
        "description": "HAL test case testCc4j712 from the External Connector module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testConnectorContactResistance",
        "name": "Connector Contact Resistance",
        "description": "HAL test case testConnectorContactResistance from the External Connector module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testConnectorMechanicalIntegrity",
        "name": "Connector Mechanical Integrity",
        "description": "HAL test case testConnectorMechanicalIntegrity from the External Connector module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testConnectorRetentionForce",
        "name": "Connector Retention Force",
        "description": "HAL test case testConnectorRetentionForce from the External Connector module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testEtc3j705",
        "name": "Etc3j705",
        "description": "HAL test case testEtc3j705 from the External Connector module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testEtcl2j704",
        "name": "Etcl2j704",
        "description": "HAL test case testEtcl2j704 from the External Connector module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testEtcl3j703",
        "name": "Etcl3j703",
        "description": "HAL test case testEtcl3j703 from the External Connector module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testEthdebugCon",
        "name": "Ethdebug Con",
        "description": "HAL test case testEthdebugCon from the External Connector module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGnssAntCon",
        "name": "Gnss Ant Con",
        "description": "HAL test case testGnssAntCon from the External Connector module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testKl15PowerInput",
        "name": "Kl15 Power Input",
        "description": "HAL test case testKl15PowerInput from the External Connector module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSv",
        "name": "Sv",
        "description": "HAL test case testSv from the External Connector module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testVcuCanInterface",
        "name": "Vcu Can Interface",
        "description": "HAL test case testVcuCanInterface from the External Connector module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "functional_safety",
    "name": "Functional Safety",
    "description": "Functional Safety HAL validation module from src/functional_safety_lib/functional_safety_lib.h.",
    "version": "1",
    "category": "safety",
    "result_type_url": "type.googleapis.com/hal.modules.functional_safety.Result",
    "config_type_url": "type.googleapis.com/hal.modules.functional_safety.Config",
    "source_path": "src/functional_safety_lib/functional_safety_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testAsilQsLAndRRailIsolation",
        "name": "Asil Qs L And R Rail Isolation",
        "description": "HAL test case testAsilQsLAndRRailIsolation from the Functional Safety module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDiagnosticCoverage",
        "name": "Diagnostic Coverage",
        "description": "HAL test case testDiagnosticCoverage from the Functional Safety module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testEccOnMemories",
        "name": "Ecc On Memories",
        "description": "HAL test case testEccOnMemories from the Functional Safety module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testFailsafeBehavior",
        "name": "Failsafe Behavior",
        "description": "HAL test case testFailsafeBehavior from the Functional Safety module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testFaultInjectionTesting",
        "name": "Fault Injection Testing",
        "description": "HAL test case testFaultInjectionTesting from the Functional Safety module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testLockstepCpuOperation",
        "name": "Lockstep Cpu Operation",
        "description": "HAL test case testLockstepCpuOperation from the Functional Safety module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testRedundantPowerSupplies",
        "name": "Redundant Power Supplies",
        "description": "HAL test case testRedundantPowerSupplies from the Functional Safety module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSafetyMonitoring",
        "name": "Safety Monitoring",
        "description": "HAL test case testSafetyMonitoring from the Functional Safety module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "gnss",
    "name": "GNSS",
    "description": "GNSS HAL validation module from src/gnss_lib/gnss_lib.h.",
    "version": "1",
    "category": "sensors",
    "result_type_url": "type.googleapis.com/hal.modules.gnss.Result",
    "config_type_url": "type.googleapis.com/hal.modules.gnss.Config",
    "source_path": "src/gnss_lib/gnss_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testAgpsFunctionality",
        "name": "Agps Functionality",
        "description": "HAL test case testAgpsFunctionality from the GNSS module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testBeidouSupport",
        "name": "Beidou Support",
        "description": "HAL test case testBeidouSupport from the GNSS module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGalileoSupport",
        "name": "Galileo Support",
        "description": "HAL test case testGalileoSupport from the GNSS module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGlonassSupport",
        "name": "Glonass Support",
        "description": "HAL test case testGlonassSupport from the GNSS module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGnssAntennaConnection",
        "name": "Gnss Antenna Connection",
        "description": "HAL test case testGnssAntennaConnection from the GNSS module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpsSignalReception",
        "name": "Gps Signal Reception",
        "description": "HAL test case testGpsSignalReception from the GNSS module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPositionAccuracy",
        "name": "Position Accuracy",
        "description": "HAL test case testPositionAccuracy from the GNSS module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testTimetofirstfix",
        "name": "Timetofirstfix",
        "description": "HAL test case testTimetofirstfix from the GNSS module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "gpio",
    "name": "Gpio",
    "description": "Gpio HAL validation module from src/gpio_lib/gpio_lib.h.",
    "version": "1",
    "category": "io",
    "result_type_url": "type.googleapis.com/hal.modules.gpio.Result",
    "config_type_url": "type.googleapis.com/hal.modules.gpio.Config",
    "source_path": "src/gpio_lib/gpio_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testConcurrentAccess",
        "name": "Concurrent Access",
        "description": "HAL test case testConcurrentAccess from the Gpio module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpioConcurrentAccess",
        "name": "Gpio Concurrent Access",
        "description": "HAL test case testGpioConcurrentAccess from the Gpio module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpioDirectionChange",
        "name": "Gpio Direction Change",
        "description": "HAL test case testGpioDirectionChange from the Gpio module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpioInputDebouncing",
        "name": "Gpio Input Debouncing",
        "description": "HAL test case testGpioInputDebouncing from the Gpio module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpioInputVoltageThreshold",
        "name": "Gpio Input Voltage Threshold",
        "description": "HAL test case testGpioInputVoltageThreshold from the Gpio module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpioInterruptGeneration",
        "name": "Gpio Interrupt Generation",
        "description": "HAL test case testGpioInterruptGeneration from the Gpio module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpioInterruptLatency",
        "name": "Gpio Interrupt Latency",
        "description": "HAL test case testGpioInterruptLatency from the Gpio module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpioOutputCurrentDriveCapability",
        "name": "Gpio Output Current Drive Capability",
        "description": "HAL test case testGpioOutputCurrentDriveCapability from the Gpio module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpioOutputSwitchingSpeed",
        "name": "Gpio Output Switching Speed",
        "description": "HAL test case testGpioOutputSwitchingSpeed from the Gpio module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpioOutputVoltageLevels",
        "name": "Gpio Output Voltage Levels",
        "description": "HAL test case testGpioOutputVoltageLevels from the Gpio module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpioPulluppulldownResistors",
        "name": "Gpio Pulluppulldown Resistors",
        "description": "HAL test case testGpioPulluppulldownResistors from the Gpio module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpioPwmOutput",
        "name": "Gpio Pwm Output",
        "description": "HAL test case testGpioPwmOutput from the Gpio module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpioReservedPins",
        "name": "Gpio Reserved Pins",
        "description": "HAL test case testGpioReservedPins from the Gpio module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpioSchmittTrigger",
        "name": "Gpio Schmitt Trigger",
        "description": "HAL test case testGpioSchmittTrigger from the Gpio module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpioTimerCounterFunctionality",
        "name": "Gpio Timer Counter Functionality",
        "description": "HAL test case testGpioTimerCounterFunctionality from the Gpio module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpioin1",
        "name": "Gpioin1",
        "description": "HAL test case testGpioin1 from the Gpio module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpioin2",
        "name": "Gpioin2",
        "description": "HAL test case testGpioin2 from the Gpio module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpioin3",
        "name": "Gpioin3",
        "description": "HAL test case testGpioin3 from the Gpio module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpioin4",
        "name": "Gpioin4",
        "description": "HAL test case testGpioin4 from the Gpio module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpioout1",
        "name": "Gpioout1",
        "description": "HAL test case testGpioout1 from the Gpio module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpioout2",
        "name": "Gpioout2",
        "description": "HAL test case testGpioout2 from the Gpio module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpioout3",
        "name": "Gpioout3",
        "description": "HAL test case testGpioout3 from the Gpio module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpioout4",
        "name": "Gpioout4",
        "description": "HAL test case testGpioout4 from the Gpio module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testInterruptGeneration",
        "name": "Interrupt Generation",
        "description": "HAL test case testInterruptGeneration from the Gpio module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPwmGeneration",
        "name": "Pwm Generation",
        "description": "HAL test case testPwmGeneration from the Gpio module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "gpu",
    "name": "GPU",
    "description": "GPU HAL validation module from src/gpu_lib/gpu_lib.h.",
    "version": "1",
    "category": "compute",
    "result_type_url": "type.googleapis.com/hal.modules.gpu.Result",
    "config_type_url": "type.googleapis.com/hal.modules.gpu.Config",
    "source_path": "src/gpu_lib/gpu_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testCacheCoherencyAndHitRates",
        "name": "Cache Coherency And Hit Rates",
        "description": "HAL test case testCacheCoherencyAndHitRates from the GPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCudaCoresFunctionality",
        "name": "Cuda Cores Functionality",
        "description": "HAL test case testCudaCoresFunctionality from the GPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testFp16ComputePerformance",
        "name": "Fp16 Compute Performance",
        "description": "HAL test case testFp16ComputePerformance from the GPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testFp16TensorCorePerformance",
        "name": "Fp16 Tensor Core Performance",
        "description": "HAL test case testFp16TensorCorePerformance from the GPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testFp32ComputePerformance",
        "name": "Fp32 Compute Performance",
        "description": "HAL test case testFp32ComputePerformance from the GPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpuClockFrequencyStabilityAndThrottling",
        "name": "Gpu Clock Frequency Stability And Throttling",
        "description": "HAL test case testGpuClockFrequencyStabilityAndThrottling from the GPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpuPowerConsumptionAtVariousLoads",
        "name": "Gpu Power Consumption At Various Loads",
        "description": "HAL test case testGpuPowerConsumptionAtVariousLoads from the GPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpuThermalThrottlingBehavior",
        "name": "Gpu Thermal Throttling Behavior",
        "description": "HAL test case testGpuThermalThrottlingBehavior from the GPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGraphicsProcessingClustersBothClusters",
        "name": "Graphics Processing Clusters Both Clusters",
        "description": "HAL test case testGraphicsProcessingClustersBothClusters from the GPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testInt8PerformanceVerification",
        "name": "Int8 Performance Verification",
        "description": "HAL test case testInt8PerformanceVerification from the GPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testInt8SparsePerformance",
        "name": "Int8 Sparse Performance",
        "description": "HAL test case testInt8SparsePerformance from the GPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testL1CachePerSm",
        "name": "L1 Cache Per Sm",
        "description": "HAL test case testL1CachePerSm from the GPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testL2Cache",
        "name": "L2 Cache",
        "description": "HAL test case testL2Cache from the GPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMemoryBandwidthToGpu",
        "name": "Memory Bandwidth To Gpu",
        "description": "HAL test case testMemoryBandwidthToGpu from the GPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMixedPrecisionOperations",
        "name": "Mixed Precision Operations",
        "description": "HAL test case testMixedPrecisionOperations from the GPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testRenderOutputUnitsAll32Rops",
        "name": "Render Output Units All32 Rops",
        "description": "HAL test case testRenderOutputUnitsAll32Rops from the GPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testStreamingMultiprocessorsAll16Sms",
        "name": "Streaming Multiprocessors All16 Sms",
        "description": "HAL test case testStreamingMultiprocessorsAll16Sms from the GPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSustainedPerformanceOverTime",
        "name": "Sustained Performance Over Time",
        "description": "HAL test case testSustainedPerformanceOverTime from the GPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testTensorCoresOperation",
        "name": "Tensor Cores Operation",
        "description": "HAL test case testTensorCoresOperation from the GPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testTextureMappingUnitsAll64Tmus",
        "name": "Texture Mapping Units All64 Tmus",
        "description": "HAL test case testTextureMappingUnitsAll64Tmus from the GPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testTextureProcessingClustersAll8Tpcs",
        "name": "Texture Processing Clusters All8 Tpcs",
        "description": "HAL test case testTextureProcessingClustersAll8Tpcs from the GPU module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "imu",
    "name": "Imu",
    "description": "Imu HAL validation module from src/imu_lib/imu_lib.h.",
    "version": "1",
    "category": "sensors",
    "result_type_url": "type.googleapis.com/hal.modules.imu.Result",
    "config_type_url": "type.googleapis.com/hal.modules.imu.Config",
    "source_path": "src/imu_lib/imu_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "test3axisAccelerometer",
        "name": "3axis Accelerometer",
        "description": "HAL test case test3axisAccelerometer from the Imu module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "test3axisGyroscope",
        "name": "3axis Gyroscope",
        "description": "HAL test case test3axisGyroscope from the Imu module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "test3axisMagnetometer",
        "name": "3axis Magnetometer",
        "description": "HAL test case test3axisMagnetometer from the Imu module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testImuAccuracy",
        "name": "Imu Accuracy",
        "description": "HAL test case testImuAccuracy from the Imu module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testImuCalibration",
        "name": "Imu Calibration",
        "description": "HAL test case testImuCalibration from the Imu module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testImuDataRate",
        "name": "Imu Data Rate",
        "description": "HAL test case testImuDataRate from the Imu module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testImuTemperatureCompensation",
        "name": "Imu Temperature Compensation",
        "description": "HAL test case testImuTemperatureCompensation from the Imu module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testImuToOrinInterface",
        "name": "Imu To Orin Interface",
        "description": "HAL test case testImuToOrinInterface from the Imu module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "mcu_interface",
    "name": "MCU Interface",
    "description": "MCU Interface HAL validation module from src/mcu_interface_lib/mcu_interface_lib.h.",
    "version": "1",
    "category": "serial_bus",
    "result_type_url": "type.googleapis.com/hal.modules.mcu_interface.Result",
    "config_type_url": "type.googleapis.com/hal.modules.mcu_interface.Config",
    "source_path": "src/mcu_interface_lib/mcu_interface_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testMcuCommunicationInterface",
        "name": "Mcu Communication Interface",
        "description": "HAL test case testMcuCommunicationInterface from the MCU Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMcuDmsInterface",
        "name": "Mcu Dms Interface",
        "description": "HAL test case testMcuDmsInterface from the MCU Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMcuFailoverMechanism",
        "name": "Mcu Failover Mechanism",
        "description": "HAL test case testMcuFailoverMechanism from the MCU Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMcuFirmwareOperation",
        "name": "Mcu Firmware Operation",
        "description": "HAL test case testMcuFirmwareOperation from the MCU Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMcuGpioInterface",
        "name": "Mcu Gpio Interface",
        "description": "HAL test case testMcuGpioInterface from the MCU Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMcuSpiInterface",
        "name": "Mcu Spi Interface",
        "description": "HAL test case testMcuSpiInterface from the MCU Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMcuSynchronization",
        "name": "Mcu Synchronization",
        "description": "HAL test case testMcuSynchronization from the MCU Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMcuToOrinDataTransfer",
        "name": "Mcu To Orin Data Transfer",
        "description": "HAL test case testMcuToOrinDataTransfer from the MCU Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMcuUartInterface",
        "name": "Mcu Uart Interface",
        "description": "HAL test case testMcuUartInterface from the MCU Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMcuWatchdog",
        "name": "Mcu Watchdog",
        "description": "HAL test case testMcuWatchdog from the MCU Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSecondaryMcuRedundancy",
        "name": "Secondary Mcu Redundancy",
        "description": "HAL test case testSecondaryMcuRedundancy from the MCU Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "pcie",
    "name": "Pcie",
    "description": "Pcie HAL validation module from src/pcie_lib/pcie_lib.h.",
    "version": "1",
    "category": "high_speed",
    "result_type_url": "type.googleapis.com/hal.modules.pcie.Result",
    "config_type_url": "type.googleapis.com/hal.modules.pcie.Config",
    "source_path": "src/pcie_lib/pcie_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testConcurrentPcieX8AndX4Operation",
        "name": "Concurrent Pcie X8 And X4 Operation",
        "description": "HAL test case testConcurrentPcieX8AndX4Operation from the Pcie module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpuAddinCardSupport",
        "name": "Gpu Addin Card Support",
        "description": "HAL test case testGpuAddinCardSupport from the Pcie module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMultiplePcieDeviceEnumeration",
        "name": "Multiple Pcie Device Enumeration",
        "description": "HAL test case testMultiplePcieDeviceEnumeration from the Pcie module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testNetworkAdapterConnectivity",
        "name": "Network Adapter Connectivity",
        "description": "HAL test case testNetworkAdapterConnectivity from the Pcie module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testNvmeSsdConnectivity",
        "name": "Nvme Ssd Connectivity",
        "description": "HAL test case testNvmeSsdConnectivity from the Pcie module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPcieErrorHandling",
        "name": "Pcie Error Handling",
        "description": "HAL test case testPcieErrorHandling from the Pcie module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPcieHotplugSupport",
        "name": "Pcie Hotplug Support",
        "description": "HAL test case testPcieHotplugSupport from the Pcie module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPcieLaneReversal",
        "name": "Pcie Lane Reversal",
        "description": "HAL test case testPcieLaneReversal from the Pcie module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPcieLatency",
        "name": "Pcie Latency",
        "description": "HAL test case testPcieLatency from the Pcie module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPcieLinkSpeed",
        "name": "Pcie Link Speed",
        "description": "HAL test case testPcieLinkSpeed from the Pcie module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPcieLinkTraining",
        "name": "Pcie Link Training",
        "description": "HAL test case testPcieLinkTraining from the Pcie module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPcieLinkWidth",
        "name": "Pcie Link Width",
        "description": "HAL test case testPcieLinkWidth from the Pcie module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPciePowerManagement",
        "name": "Pcie Power Management",
        "description": "HAL test case testPciePowerManagement from the Pcie module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPcieReadBandwidth",
        "name": "Pcie Read Bandwidth",
        "description": "HAL test case testPcieReadBandwidth from the Pcie module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPcieSwitchCompatibility",
        "name": "Pcie Switch Compatibility",
        "description": "HAL test case testPcieSwitchCompatibility from the Pcie module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPcieWriteBandwidth",
        "name": "Pcie Write Bandwidth",
        "description": "HAL test case testPcieWriteBandwidth from the Pcie module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPcieX4Bandwidth",
        "name": "Pcie X4 Bandwidth",
        "description": "HAL test case testPcieX4Bandwidth from the Pcie module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPcieX4LaneFunctionality",
        "name": "Pcie X4 Lane Functionality",
        "description": "HAL test case testPcieX4LaneFunctionality from the Pcie module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSecondaryPcieLinkTraining",
        "name": "Secondary Pcie Link Training",
        "description": "HAL test case testSecondaryPcieLinkTraining from the Pcie module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "poe_hat",
    "name": "Poe Hat",
    "description": "Poe Hat HAL validation module from src/poe_hat_lib/poe_hat_lib.h.",
    "version": "1",
    "category": "power",
    "result_type_url": "type.googleapis.com/hal.modules.poe_hat.Result",
    "config_type_url": "type.googleapis.com/hal.modules.poe_hat.Config",
    "source_path": "src/poe_hat_lib/poe_hat_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testFanControl",
        "name": "Fan Control",
        "description": "HAL test case testFanControl from the Poe Hat module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testFanSpeed",
        "name": "Fan Speed",
        "description": "HAL test case testFanSpeed from the Poe Hat module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPoeHatDetection",
        "name": "Poe Hat Detection",
        "description": "HAL test case testPoeHatDetection from the Poe Hat module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPoePowerNegotiation",
        "name": "Poe Power Negotiation",
        "description": "HAL test case testPoePowerNegotiation from the Poe Hat module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPowerDelivery",
        "name": "Power Delivery",
        "description": "HAL test case testPowerDelivery from the Poe Hat module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPowerMonitoring",
        "name": "Power Monitoring",
        "description": "HAL test case testPowerMonitoring from the Poe Hat module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testThermalProtection",
        "name": "Thermal Protection",
        "description": "HAL test case testThermalProtection from the Poe Hat module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testVoltageRegulator",
        "name": "Voltage Regulator",
        "description": "HAL test case testVoltageRegulator from the Poe Hat module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "power_management",
    "name": "Power Management",
    "description": "Power Management HAL validation module from src/power_management_lib/power_management_lib.h.",
    "version": "1",
    "category": "power",
    "result_type_url": "type.googleapis.com/hal.modules.power_management.Result",
    "config_type_url": "type.googleapis.com/hal.modules.power_management.Config",
    "source_path": "src/power_management_lib/power_management_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "test12vAsilQsLRail",
        "name": "12v Asil Qs L Rail",
        "description": "HAL test case test12vAsilQsLRail from the Power Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "test12vAsilQsRRail",
        "name": "12v Asil Qs R Rail",
        "description": "HAL test case test12vAsilQsRRail from the Power Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testAllInternalVoltageRails",
        "name": "All Internal Voltage Rails",
        "description": "HAL test case testAllInternalVoltageRails from the Power Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testBatteryCharging",
        "name": "Battery Charging",
        "description": "HAL test case testBatteryCharging from the Power Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testBrownoutDetection",
        "name": "Brownout Detection",
        "description": "HAL test case testBrownoutDetection from the Power Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testIdlePowerConsumption",
        "name": "Idle Power Consumption",
        "description": "HAL test case testIdlePowerConsumption from the Power Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMaximumPerformanceMode",
        "name": "Maximum Performance Mode",
        "description": "HAL test case testMaximumPerformanceMode from the Power Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testOvercurrentProtection",
        "name": "Overcurrent Protection",
        "description": "HAL test case testOvercurrentProtection from the Power Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testOvervoltageProtection",
        "name": "Overvoltage Protection",
        "description": "HAL test case testOvervoltageProtection from the Power Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPercomponentPowerMeasurement",
        "name": "Percomponent Power Measurement",
        "description": "HAL test case testPercomponentPowerMeasurement from the Power Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPowerButtonFunctionality",
        "name": "Power Button Functionality",
        "description": "HAL test case testPowerButtonFunctionality from the Power Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPowerEfficiencyCalculation",
        "name": "Power Efficiency Calculation",
        "description": "HAL test case testPowerEfficiencyCalculation from the Power Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPowerSequencing",
        "name": "Power Sequencing",
        "description": "HAL test case testPowerSequencing from the Power Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPowerStateTransitions",
        "name": "Power State Transitions",
        "description": "HAL test case testPowerStateTransitions from the Power Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPowerSupplyRejection",
        "name": "Power Supply Rejection",
        "description": "HAL test case testPowerSupplyRejection from the Power Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPoweronReset",
        "name": "Poweron Reset",
        "description": "HAL test case testPoweronReset from the Power Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPoweroptimizedModes",
        "name": "Poweroptimized Modes",
        "description": "HAL test case testPoweroptimizedModes from the Power Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testRealtimePowerConsumption",
        "name": "Realtime Power Consumption",
        "description": "HAL test case testRealtimePowerConsumption from the Power Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSleepStates",
        "name": "Sleep States",
        "description": "HAL test case testSleepStates from the Power Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testUndervoltageProtection",
        "name": "Undervoltage Protection",
        "description": "HAL test case testUndervoltageProtection from the Power Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testUpsFunctionality",
        "name": "Ups Functionality",
        "description": "HAL test case testUpsFunctionality from the Power Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testWakeupSources",
        "name": "Wakeup Sources",
        "description": "HAL test case testWakeupSources from the Power Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "reliability",
    "name": "Reliability",
    "description": "Reliability HAL validation module from src/reliability_lib/reliability_lib.h.",
    "version": "1",
    "category": "safety",
    "result_type_url": "type.googleapis.com/hal.modules.reliability.Result",
    "config_type_url": "type.googleapis.com/hal.modules.reliability.Config",
    "source_path": "src/reliability_lib/reliability_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testBurninTesting",
        "name": "Burnin Testing",
        "description": "HAL test case testBurninTesting from the Reliability module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testComponentAging",
        "name": "Component Aging",
        "description": "HAL test case testComponentAging from the Reliability module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMtbf",
        "name": "Mtbf",
        "description": "HAL test case testMtbf from the Reliability module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPowerCycling",
        "name": "Power Cycling",
        "description": "HAL test case testPowerCycling from the Reliability module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSolderJointIntegrity",
        "name": "Solder Joint Integrity",
        "description": "HAL test case testSolderJointIntegrity from the Reliability module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testThermalCycling",
        "name": "Thermal Cycling",
        "description": "HAL test case testThermalCycling from the Reliability module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "security_features",
    "name": "Security Features",
    "description": "Security Features HAL validation module from src/security_features_lib/security_features_lib.h.",
    "version": "1",
    "category": "safety",
    "result_type_url": "type.googleapis.com/hal.modules.security_features.Result",
    "config_type_url": "type.googleapis.com/hal.modules.security_features.Config",
    "source_path": "src/security_features_lib/security_features_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testBootRomExecution",
        "name": "Boot Rom Execution",
        "description": "HAL test case testBootRomExecution from the Security Features module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testBootloaderSignatureVerification",
        "name": "Bootloader Signature Verification",
        "description": "HAL test case testBootloaderSignatureVerification from the Security Features module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCryptographicAccelerators",
        "name": "Cryptographic Accelerators",
        "description": "HAL test case testCryptographicAccelerators from the Security Features module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDebugPortSecurity",
        "name": "Debug Port Security",
        "description": "HAL test case testDebugPortSecurity from the Security Features module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testHardwareRandomNumberGenerator",
        "name": "Hardware Random Number Generator",
        "description": "HAL test case testHardwareRandomNumberGenerator from the Security Features module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testHardwareRootOfTrust",
        "name": "Hardware Root Of Trust",
        "description": "HAL test case testHardwareRootOfTrust from the Security Features module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testJtagSecurity",
        "name": "Jtag Security",
        "description": "HAL test case testJtagSecurity from the Security Features module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testKernelSignatureVerification",
        "name": "Kernel Signature Verification",
        "description": "HAL test case testKernelSignatureVerification from the Security Features module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMemoryEncryption",
        "name": "Memory Encryption",
        "description": "HAL test case testMemoryEncryption from the Security Features module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSecureBootChainOfTrust",
        "name": "Secure Boot Chain Of Trust",
        "description": "HAL test case testSecureBootChainOfTrust from the Security Features module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSecureStorage",
        "name": "Secure Storage",
        "description": "HAL test case testSecureStorage from the Security Features module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "sense_hat",
    "name": "Sense Hat",
    "description": "Sense Hat HAL validation module from src/sense_hat_lib/sense_hat_lib.h.",
    "version": "1",
    "category": "sensors",
    "result_type_url": "type.googleapis.com/hal.modules.sense_hat.Result",
    "config_type_url": "type.googleapis.com/hal.modules.sense_hat.Config",
    "source_path": "src/sense_hat_lib/sense_hat_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testHumiditySensor",
        "name": "Humidity Sensor",
        "description": "HAL test case testHumiditySensor from the Sense Hat module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testI2cBusIntegrity",
        "name": "I2c Bus Integrity",
        "description": "HAL test case testI2cBusIntegrity from the Sense Hat module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testImuSensors",
        "name": "Imu Sensors",
        "description": "HAL test case testImuSensors from the Sense Hat module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testJoystick",
        "name": "Joystick",
        "description": "HAL test case testJoystick from the Sense Hat module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testLedMatrix",
        "name": "Led Matrix",
        "description": "HAL test case testLedMatrix from the Sense Hat module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPressureSensor",
        "name": "Pressure Sensor",
        "description": "HAL test case testPressureSensor from the Sense Hat module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSenseHatDetection",
        "name": "Sense Hat Detection",
        "description": "HAL test case testSenseHatDetection from the Sense Hat module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testTemperatureSensor",
        "name": "Temperature Sensor",
        "description": "HAL test case testTemperatureSensor from the Sense Hat module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "serializer_deserializer",
    "name": "Serializer Deserializer",
    "description": "Serializer Deserializer HAL validation module from src/serializer_deserializer_lib/serializer_deserializer_lib.h.",
    "version": "1",
    "category": "high_speed",
    "result_type_url": "type.googleapis.com/hal.modules.serializer_deserializer.Result",
    "config_type_url": "type.googleapis.com/hal.modules.serializer_deserializer.Config",
    "source_path": "src/serializer_deserializer_lib/serializer_deserializer_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testClockRecovery",
        "name": "Clock Recovery",
        "description": "HAL test case testClockRecovery from the Serializer Deserializer module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDataIntegrity",
        "name": "Data Integrity",
        "description": "HAL test case testDataIntegrity from the Serializer Deserializer module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDeserializationFunctionality",
        "name": "Deserialization Functionality",
        "description": "HAL test case testDeserializationFunctionality from the Serializer Deserializer module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testErrorDetection",
        "name": "Error Detection",
        "description": "HAL test case testErrorDetection from the Serializer Deserializer module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testLinkSpeed",
        "name": "Link Speed",
        "description": "HAL test case testLinkSpeed from the Serializer Deserializer module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMultistreamSupport",
        "name": "Multistream Support",
        "description": "HAL test case testMultistreamSupport from the Serializer Deserializer module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSerializationFunctionality",
        "name": "Serialization Functionality",
        "description": "HAL test case testSerializationFunctionality from the Serializer Deserializer module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "software_interface",
    "name": "Software Interface",
    "description": "Software Interface HAL validation module from src/software_interface_lib/software_interface_lib.h.",
    "version": "1",
    "category": "system",
    "result_type_url": "type.googleapis.com/hal.modules.software_interface.Result",
    "config_type_url": "type.googleapis.com/hal.modules.software_interface.Config",
    "source_path": "src/software_interface_lib/software_interface_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testApplicationFramework",
        "name": "Application Framework",
        "description": "HAL test case testApplicationFramework from the Software Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCudaRuntime",
        "name": "Cuda Runtime",
        "description": "HAL test case testCudaRuntime from the Software Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCudnnLibrary",
        "name": "Cudnn Library",
        "description": "HAL test case testCudnnLibrary from the Software Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDeviceDriverLoading",
        "name": "Device Driver Loading",
        "description": "HAL test case testDeviceDriverLoading from the Software Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testLinuxKernelBoot",
        "name": "Linux Kernel Boot",
        "description": "HAL test case testLinuxKernelBoot from the Software Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMultimediaApi",
        "name": "Multimedia Api",
        "description": "HAL test case testMultimediaApi from the Software Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMultiuserSupport",
        "name": "Multiuser Support",
        "description": "HAL test case testMultiuserSupport from the Software Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSensorDriverFramework",
        "name": "Sensor Driver Framework",
        "description": "HAL test case testSensorDriverFramework from the Software Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSystemServiceStartup",
        "name": "System Service Startup",
        "description": "HAL test case testSystemServiceStartup from the Software Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testTensorrtInference",
        "name": "Tensorrt Inference",
        "description": "HAL test case testTensorrtInference from the Software Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testVpi",
        "name": "Vpi",
        "description": "HAL test case testVpi from the Software Interface module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "storage",
    "name": "Storage",
    "description": "Storage HAL validation module from src/storage_lib/storage_lib.h.",
    "version": "1",
    "category": "storage",
    "result_type_url": "type.googleapis.com/hal.modules.storage.Result",
    "config_type_url": "type.googleapis.com/hal.modules.storage.Config",
    "source_path": "src/storage_lib/storage_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testBadBlockManagement",
        "name": "Bad Block Management",
        "description": "HAL test case testBadBlockManagement from the Storage module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testEmmc51InterfaceFunctionality",
        "name": "Emmc51 Interface Functionality",
        "description": "HAL test case testEmmc51InterfaceFunctionality from the Storage module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testEmmcTemperatureMonitoring",
        "name": "Emmc Temperature Monitoring",
        "description": "HAL test case testEmmcTemperatureMonitoring from the Storage module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testEmmcWearLeveling",
        "name": "Emmc Wear Leveling",
        "description": "HAL test case testEmmcWearLeveling from the Storage module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testFullCapacityVerification",
        "name": "Full Capacity Verification",
        "description": "HAL test case testFullCapacityVerification from the Storage module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testHotplugCapability",
        "name": "Hotplug Capability",
        "description": "HAL test case testHotplugCapability from the Storage module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testNvmeReadwritePerformance",
        "name": "Nvme Readwrite Performance",
        "description": "HAL test case testNvmeReadwritePerformance from the Storage module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testNvmeSsdDetection",
        "name": "Nvme Ssd Detection",
        "description": "HAL test case testNvmeSsdDetection from the Storage module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testNvmeThermalThrottling",
        "name": "Nvme Thermal Throttling",
        "description": "HAL test case testNvmeThermalThrottling from the Storage module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPowerLossProtection",
        "name": "Power Loss Protection",
        "description": "HAL test case testPowerLossProtection from the Storage module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testRandomReadIops",
        "name": "Random Read Iops",
        "description": "HAL test case testRandomReadIops from the Storage module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testRandomWriteIops",
        "name": "Random Write Iops",
        "description": "HAL test case testRandomWriteIops from the Storage module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSequentialReadPerformance",
        "name": "Sequential Read Performance",
        "description": "HAL test case testSequentialReadPerformance from the Storage module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSequentialWritePerformance",
        "name": "Sequential Write Performance",
        "description": "HAL test case testSequentialWritePerformance from the Storage module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testStorageEncryptionSupport",
        "name": "Storage Encryption Support",
        "description": "HAL test case testStorageEncryptionSupport from the Storage module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "system_integration",
    "name": "System Integration",
    "description": "System Integration HAL validation module from src/system_integration_lib/system_integration_lib.h.",
    "version": "1",
    "category": "system",
    "result_type_url": "type.googleapis.com/hal.modules.system_integration.Result",
    "config_type_url": "type.googleapis.com/hal.modules.system_integration.Config",
    "source_path": "src/system_integration_lib/system_integration_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testAutonomousDrivingStack",
        "name": "Autonomous Driving Stack",
        "description": "HAL test case testAutonomousDrivingStack from the System Integration module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testConcurrentOperationOfAllSubsystems",
        "name": "Concurrent Operation Of All Subsystems",
        "description": "HAL test case testConcurrentOperationOfAllSubsystems from the System Integration module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testEndtoendLatency",
        "name": "Endtoend Latency",
        "description": "HAL test case testEndtoendLatency from the System Integration module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMultimodalAiWorkloads",
        "name": "Multimodal Ai Workloads",
        "description": "HAL test case testMultimodalAiWorkloads from the System Integration module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testResourceContentionHandling",
        "name": "Resource Contention Handling",
        "description": "HAL test case testResourceContentionHandling from the System Integration module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSensorFusionPipeline",
        "name": "Sensor Fusion Pipeline",
        "description": "HAL test case testSensorFusionPipeline from the System Integration module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSystemBottleneckIdentification",
        "name": "System Bottleneck Identification",
        "description": "HAL test case testSystemBottleneckIdentification from the System Integration module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSystemThroughput",
        "name": "System Throughput",
        "description": "HAL test case testSystemThroughput from the System Integration module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "system_memory",
    "name": "System Memory",
    "description": "System Memory HAL validation module from src/system_memory_lib/system_memory_lib.h.",
    "version": "1",
    "category": "compute",
    "result_type_url": "type.googleapis.com/hal.modules.system_memory.Result",
    "config_type_url": "type.googleapis.com/hal.modules.system_memory.Config",
    "source_path": "src/system_memory_lib/system_memory_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "test256bitMemoryInterface",
        "name": "256bit Memory Interface",
        "description": "HAL test case test256bitMemoryInterface from the System Memory module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testAll64gbMemoryAccessibility",
        "name": "All64gb Memory Accessibility",
        "description": "HAL test case testAll64gbMemoryAccessibility from the System Memory module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testConcurrentMemoryAccessPatterns",
        "name": "Concurrent Memory Access Patterns",
        "description": "HAL test case testConcurrentMemoryAccessPatterns from the System Memory module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDmaTofromMemory",
        "name": "Dma Tofrom Memory",
        "description": "HAL test case testDmaTofromMemory from the System Memory module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMemoryAllocationdeallocation",
        "name": "Memory Allocationdeallocation",
        "description": "HAL test case testMemoryAllocationdeallocation from the System Memory module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMemoryBandwidth",
        "name": "Memory Bandwidth",
        "description": "HAL test case testMemoryBandwidth from the System Memory module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMemoryBankTesting",
        "name": "Memory Bank Testing",
        "description": "HAL test case testMemoryBankTesting from the System Memory module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMemoryClockFrequency",
        "name": "Memory Clock Frequency",
        "description": "HAL test case testMemoryClockFrequency from the System Memory module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMemoryErrorCorrection",
        "name": "Memory Error Correction",
        "description": "HAL test case testMemoryErrorCorrection from the System Memory module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMemoryFragmentationHandling",
        "name": "Memory Fragmentation Handling",
        "description": "HAL test case testMemoryFragmentationHandling from the System Memory module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMemoryLatencyMeasurements",
        "name": "Memory Latency Measurements",
        "description": "HAL test case testMemoryLatencyMeasurements from the System Memory module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMemoryLeaksDetection",
        "name": "Memory Leaks Detection",
        "description": "HAL test case testMemoryLeaksDetection from the System Memory module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMemoryThermalBehavior",
        "name": "Memory Thermal Behavior",
        "description": "HAL test case testMemoryThermalBehavior from the System Memory module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testOutofmemoryConditions",
        "name": "Outofmemory Conditions",
        "description": "HAL test case testOutofmemoryConditions from the System Memory module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testRandomReadwritePerformance",
        "name": "Random Readwrite Performance",
        "description": "HAL test case testRandomReadwritePerformance from the System Memory module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSequentialReadwritePerformance",
        "name": "Sequential Readwrite Performance",
        "description": "HAL test case testSequentialReadwritePerformance from the System Memory module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "thermal_management",
    "name": "Thermal Management",
    "description": "Thermal Management HAL validation module from src/thermal_management_lib/thermal_management_lib.h.",
    "version": "1",
    "category": "sensors",
    "result_type_url": "type.googleapis.com/hal.modules.thermal_management.Result",
    "config_type_url": "type.googleapis.com/hal.modules.thermal_management.Config",
    "source_path": "src/thermal_management_lib/thermal_management_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testAllThermalZones",
        "name": "All Thermal Zones",
        "description": "HAL test case testAllThermalZones from the Thermal Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testBoardAmbientTemperature",
        "name": "Board Ambient Temperature",
        "description": "HAL test case testBoardAmbientTemperature from the Thermal Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCoolingSolutionEffectiveness",
        "name": "Cooling Solution Effectiveness",
        "description": "HAL test case testCoolingSolutionEffectiveness from the Thermal Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCpuTemperature",
        "name": "Cpu Temperature",
        "description": "HAL test case testCpuTemperature from the Thermal Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testFanControl",
        "name": "Fan Control",
        "description": "HAL test case testFanControl from the Thermal Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testGpuTemperature",
        "name": "Gpu Temperature",
        "description": "HAL test case testGpuTemperature from the Thermal Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMemoryTemperature",
        "name": "Memory Temperature",
        "description": "HAL test case testMemoryTemperature from the Thermal Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSocJunctionTemperature",
        "name": "Soc Junction Temperature",
        "description": "HAL test case testSocJunctionTemperature from the Thermal Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSustainedThermalPerformance",
        "name": "Sustained Thermal Performance",
        "description": "HAL test case testSustainedThermalPerformance from the Thermal Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testTemperatureDistributionAcrossDie",
        "name": "Temperature Distribution Across Die",
        "description": "HAL test case testTemperatureDistributionAcrossDie from the Thermal Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testThermalRecoveryTime",
        "name": "Thermal Recovery Time",
        "description": "HAL test case testThermalRecoveryTime from the Thermal Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testThermalShutdownTemperature",
        "name": "Thermal Shutdown Temperature",
        "description": "HAL test case testThermalShutdownTemperature from the Thermal Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testThermalThrottlingThresholds",
        "name": "Thermal Throttling Thresholds",
        "description": "HAL test case testThermalThrottlingThresholds from the Thermal Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "usb",
    "name": "USB",
    "description": "USB HAL validation module from src/usb_lib/usb_lib.h.",
    "version": "1",
    "category": "high_speed",
    "result_type_url": "type.googleapis.com/hal.modules.usb.Result",
    "config_type_url": "type.googleapis.com/hal.modules.usb.Config",
    "source_path": "src/usb_lib/usb_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testMultipleUsbDeviceEnumeration",
        "name": "Multiple Usb Device Enumeration",
        "description": "HAL test case testMultipleUsbDeviceEnumeration from the USB module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testUsb20BackwardCompatibility",
        "name": "Usb20 Backward Compatibility",
        "description": "HAL test case testUsb20BackwardCompatibility from the USB module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testUsb31Gen1BackwardCompatibility",
        "name": "Usb31 Gen1 Backward Compatibility",
        "description": "HAL test case testUsb31Gen1BackwardCompatibility from the USB module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testUsb32Gen2Speed",
        "name": "Usb32 Gen2 Speed",
        "description": "HAL test case testUsb32Gen2Speed from the USB module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testUsbAudioDevices",
        "name": "Usb Audio Devices",
        "description": "HAL test case testUsbAudioDevices from the USB module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testUsbCameras",
        "name": "Usb Cameras",
        "description": "HAL test case testUsbCameras from the USB module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testUsbDeviceMode",
        "name": "Usb Device Mode",
        "description": "HAL test case testUsbDeviceMode from the USB module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testUsbHidDevices",
        "name": "Usb Hid Devices",
        "description": "HAL test case testUsbHidDevices from the USB module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testUsbHostMode",
        "name": "Usb Host Mode",
        "description": "HAL test case testUsbHostMode from the USB module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testUsbHotplugDetection",
        "name": "Usb Hotplug Detection",
        "description": "HAL test case testUsbHotplugDetection from the USB module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testUsbHubs",
        "name": "Usb Hubs",
        "description": "HAL test case testUsbHubs from the USB module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testUsbMassStorageDevices",
        "name": "Usb Mass Storage Devices",
        "description": "HAL test case testUsbMassStorageDevices from the USB module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testUsbNetworkAdapters",
        "name": "Usb Network Adapters",
        "description": "HAL test case testUsbNetworkAdapters from the USB module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testUsbPowerDelivery",
        "name": "Usb Power Delivery",
        "description": "HAL test case testUsbPowerDelivery from the USB module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testUsbSuspendresume",
        "name": "Usb Suspendresume",
        "description": "HAL test case testUsbSuspendresume from the USB module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "video_encode_decode",
    "name": "Video Encode Decode",
    "description": "Video Encode Decode HAL validation module from src/video_encode_decode_lib/video_encode_decode_lib.h.",
    "version": "1",
    "category": "compute",
    "result_type_url": "type.googleapis.com/hal.modules.video_encode_decode.Result",
    "config_type_url": "type.googleapis.com/hal.modules.video_encode_decode.Config",
    "source_path": "src/video_encode_decode_lib/video_encode_decode_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "test4k8kDecoding",
        "name": "4k8k Decoding",
        "description": "HAL test case test4k8kDecoding from the Video Encode Decode module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testAv1Decoding",
        "name": "Av1 Decoding",
        "description": "HAL test case testAv1Decoding from the Video Encode Decode module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testAv1Encoding",
        "name": "Av1 Encoding",
        "description": "HAL test case testAv1Encoding from the Video Encode Decode module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testColorSpaceConversions",
        "name": "Color Space Conversions",
        "description": "HAL test case testColorSpaceConversions from the Video Encode Decode module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testCorruptStreamHandling",
        "name": "Corrupt Stream Handling",
        "description": "HAL test case testCorruptStreamHandling from the Video Encode Decode module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDecoderLatency",
        "name": "Decoder Latency",
        "description": "HAL test case testDecoderLatency from the Video Encode Decode module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testEncoderLatency",
        "name": "Encoder Latency",
        "description": "HAL test case testEncoderLatency from the Video Encode Decode module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testEncoderPowerConsumption",
        "name": "Encoder Power Consumption",
        "description": "HAL test case testEncoderPowerConsumption from the Video Encode Decode module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testEncoderQualitySettings",
        "name": "Encoder Quality Settings",
        "description": "HAL test case testEncoderQualitySettings from the Video Encode Decode module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testH264Decoding",
        "name": "H264 Decoding",
        "description": "HAL test case testH264Decoding from the Video Encode Decode module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testH264Encoding",
        "name": "H264 Encoding",
        "description": "HAL test case testH264Encoding from the Video Encode Decode module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testH265Decoding",
        "name": "H265 Decoding",
        "description": "HAL test case testH265Decoding from the Video Encode Decode module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testH265Encoding",
        "name": "H265 Encoding",
        "description": "HAL test case testH265Encoding from the Video Encode Decode module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testImageScalingOperations",
        "name": "Image Scaling Operations",
        "description": "HAL test case testImageScalingOperations from the Video Encode Decode module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testJpegCompression",
        "name": "Jpeg Compression",
        "description": "HAL test case testJpegCompression from the Video Encode Decode module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testJpegDecompression",
        "name": "Jpeg Decompression",
        "description": "HAL test case testJpegDecompression from the Video Encode Decode module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testJpegQualityLevels",
        "name": "Jpeg Quality Levels",
        "description": "HAL test case testJpegQualityLevels from the Video Encode Decode module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMultipleStreamDecoding",
        "name": "Multiple Stream Decoding",
        "description": "HAL test case testMultipleStreamDecoding from the Video Encode Decode module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testMultipleStreamEncoding",
        "name": "Multiple Stream Encoding",
        "description": "HAL test case testMultipleStreamEncoding from the Video Encode Decode module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testNvjpgThroughput",
        "name": "Nvjpg Throughput",
        "description": "HAL test case testNvjpgThroughput from the Video Encode Decode module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testVariousBitrates",
        "name": "Various Bitrates",
        "description": "HAL test case testVariousBitrates from the Video Encode Decode module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testVariousFrameRates",
        "name": "Various Frame Rates",
        "description": "HAL test case testVariousFrameRates from the Video Encode Decode module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testVariousResolutions",
        "name": "Various Resolutions",
        "description": "HAL test case testVariousResolutions from the Video Encode Decode module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testVp9Decoding",
        "name": "Vp9 Decoding",
        "description": "HAL test case testVp9Decoding from the Video Encode Decode module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testYuvFormatConversions",
        "name": "Yuv Format Conversions",
        "description": "HAL test case testYuvFormatConversions from the Video Encode Decode module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "vision_accelerator",
    "name": "Vision Accelerator",
    "description": "Vision Accelerator HAL validation module from src/vision_accelerator_lib/vision_accelerator_lib.h.",
    "version": "1",
    "category": "compute",
    "result_type_url": "type.googleapis.com/hal.modules.vision_accelerator.Result",
    "config_type_url": "type.googleapis.com/hal.modules.vision_accelerator.Config",
    "source_path": "src/vision_accelerator_lib/vision_accelerator_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "test16HardwareChannelsPerEngine",
        "name": "16 Hardware Channels Per Engine",
        "description": "HAL test case test16HardwareChannelsPerEngine from the Vision Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "test5dimensionalAddressing",
        "name": "5dimensional Addressing",
        "description": "HAL test case test5dimensionalAddressing from the Vision Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testComputerVisionAlgorithms",
        "name": "Computer Vision Algorithms",
        "description": "HAL test case testComputerVisionAlgorithms from the Vision Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDmaBandwidthTesting",
        "name": "Dma Bandwidth Testing",
        "description": "HAL test case testDmaBandwidthTesting from the Vision Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDmaEngine1Functionality",
        "name": "Dma Engine1 Functionality",
        "description": "HAL test case testDmaEngine1Functionality from the Vision Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDmaEngine2Functionality",
        "name": "Dma Engine2 Functionality",
        "description": "HAL test case testDmaEngine2Functionality from the Vision Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDmaLatencyTesting",
        "name": "Dma Latency Testing",
        "description": "HAL test case testDmaLatencyTesting from the Vision Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testDualVectorProcessingUnits",
        "name": "Dual Vector Processing Units",
        "description": "HAL test case testDualVectorProcessingUnits from the Vision Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testFeatureDetection",
        "name": "Feature Detection",
        "description": "HAL test case testFeatureDetection from the Vision Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testImageProcessingPipelines",
        "name": "Image Processing Pipelines",
        "description": "HAL test case testImageProcessingPipelines from the Vision Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testOpticalFlow",
        "name": "Optical Flow",
        "description": "HAL test case testOpticalFlow from the Vision Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPvaPowerConsumption",
        "name": "Pva Power Consumption",
        "description": "HAL test case testPvaPowerConsumption from the Vision Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testScalarExecutionUnits",
        "name": "Scalar Execution Units",
        "description": "HAL test case testScalarExecutionUnits from the Vision Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testStereoDisparity",
        "name": "Stereo Disparity",
        "description": "HAL test case testStereoDisparity from the Vision Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testVectorCoresInEachVpu",
        "name": "Vector Cores In Each Vpu",
        "description": "HAL test case testVectorCoresInEachVpu from the Vision Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testVectorExecutionUnits",
        "name": "Vector Execution Units",
        "description": "HAL test case testVectorExecutionUnits from the Vision Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testVliwSlots",
        "name": "Vliw Slots",
        "description": "HAL test case testVliwSlots from the Vision Accelerator module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "watchdog_and_reset",
    "name": "Watchdog And Reset",
    "description": "Watchdog And Reset HAL validation module from src/watchdog_and_reset_lib/watchdog_and_reset_lib.h.",
    "version": "1",
    "category": "safety",
    "result_type_url": "type.googleapis.com/hal.modules.watchdog_and_reset.Result",
    "config_type_url": "type.googleapis.com/hal.modules.watchdog_and_reset.Config",
    "source_path": "src/watchdog_and_reset_lib/watchdog_and_reset_lib.h",
    "modes": [
      "single_shot",
      "monitoring",
      "event",
      "long_run"
    ],
    "tests": [
      {
        "id": "testHardwareResetButton",
        "name": "Hardware Reset Button",
        "description": "HAL test case testHardwareResetButton from the Watchdog And Reset module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testPoweronReset",
        "name": "Poweron Reset",
        "description": "HAL test case testPoweronReset from the Watchdog And Reset module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testResetReasonLogging",
        "name": "Reset Reason Logging",
        "description": "HAL test case testResetReasonLogging from the Watchdog And Reset module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testSoftwareReset",
        "name": "Software Reset",
        "description": "HAL test case testSoftwareReset from the Watchdog And Reset module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testThermalReset",
        "name": "Thermal Reset",
        "description": "HAL test case testThermalReset from the Watchdog And Reset module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testWatchdogInterruptGeneration",
        "name": "Watchdog Interrupt Generation",
        "description": "HAL test case testWatchdogInterruptGeneration from the Watchdog And Reset module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testWatchdogReset",
        "name": "Watchdog Reset",
        "description": "HAL test case testWatchdogReset from the Watchdog And Reset module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testWatchdogResetGeneration",
        "name": "Watchdog Reset Generation",
        "description": "HAL test case testWatchdogResetGeneration from the Watchdog And Reset module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testWatchdogTimeoutConfiguration",
        "name": "Watchdog Timeout Configuration",
        "description": "HAL test case testWatchdogTimeoutConfiguration from the Watchdog And Reset module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      },
      {
        "id": "testWatchdogTimerFunctionality",
        "name": "Watchdog Timer Functionality",
        "description": "HAL test case testWatchdogTimerFunctionality from the Watchdog And Reset module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "i2c",
    "name": "I2C Bus",
    "description": "I2C bus communication testing",
    "version": "1.0.0",
    "category": "serial_bus",
    "result_type_url": "type.googleapis.com/hal.modules.i2c.Result",
    "config_type_url": "type.googleapis.com/hal.modules.i2c.Config",
    "source_path": "",
    "modes": [
      "single_shot",
      "long_run",
      "monitoring"
    ],
    "tests": [
      {
        "id": "i2c_availability",
        "name": "I2c Availability",
        "description": "HAL test case i2c_availability from the I2C Bus module.",
        "modes": [
          "single_shot",
          "long_run",
          "monitoring"
        ]
      }
    ]
  },
  {
    "id": "spi",
    "name": "SPI Bus",
    "description": "SPI bus communication testing",
    "version": "1.0.0",
    "category": "serial_bus",
    "result_type_url": "type.googleapis.com/hal.modules.spi.Result",
    "config_type_url": "type.googleapis.com/hal.modules.spi.Config",
    "source_path": "",
    "modes": [
      "single_shot",
      "long_run"
    ],
    "tests": [
      {
        "id": "spi_availability",
        "name": "Spi Availability",
        "description": "HAL test case spi_availability from the SPI Bus module.",
        "modes": [
          "single_shot",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "uart",
    "name": "UART",
    "description": "UART/serial communication testing",
    "version": "1.0.0",
    "category": "serial_bus",
    "result_type_url": "type.googleapis.com/hal.modules.uart.Result",
    "config_type_url": "type.googleapis.com/hal.modules.uart.Config",
    "source_path": "",
    "modes": [
      "single_shot",
      "long_run",
      "monitoring"
    ],
    "tests": [
      {
        "id": "uart_availability",
        "name": "Uart Availability",
        "description": "HAL test case uart_availability from the UART module.",
        "modes": [
          "single_shot",
          "long_run",
          "monitoring"
        ]
      }
    ]
  },
  {
    "id": "rtc",
    "name": "Real-Time Clock",
    "description": "Real-time clock accuracy and persistence testing",
    "version": "1.0.0",
    "category": "timing",
    "result_type_url": "type.googleapis.com/hal.modules.rtc.Result",
    "config_type_url": "type.googleapis.com/hal.modules.rtc.Config",
    "source_path": "",
    "modes": [
      "single_shot",
      "monitoring"
    ],
    "tests": [
      {
        "id": "rtc_availability",
        "name": "Rtc Availability",
        "description": "HAL test case rtc_availability from the Real-Time Clock module.",
        "modes": [
          "single_shot",
          "monitoring"
        ]
      }
    ]
  },
  {
    "id": "battery",
    "name": "Battery Management",
    "description": "Battery charge, health, and capacity testing",
    "version": "1.0.0",
    "category": "power",
    "result_type_url": "type.googleapis.com/hal.modules.battery.Result",
    "config_type_url": "type.googleapis.com/hal.modules.battery.Config",
    "source_path": "",
    "modes": [
      "single_shot",
      "monitoring",
      "event"
    ],
    "tests": [
      {
        "id": "battery_availability",
        "name": "Battery Availability",
        "description": "HAL test case battery_availability from the Battery Management module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event"
        ]
      }
    ]
  },
  {
    "id": "nvme",
    "name": "NVMe Storage",
    "description": "NVMe SSD performance and health testing",
    "version": "1.0.0",
    "category": "storage",
    "result_type_url": "type.googleapis.com/hal.modules.nvme.Result",
    "config_type_url": "type.googleapis.com/hal.modules.nvme.Config",
    "source_path": "",
    "modes": [
      "single_shot",
      "long_run"
    ],
    "tests": [
      {
        "id": "nvme_availability",
        "name": "Nvme Availability",
        "description": "HAL test case nvme_availability from the NVMe Storage module.",
        "modes": [
          "single_shot",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "emmc",
    "name": "eMMC Storage",
    "description": "eMMC flash storage testing",
    "version": "1.0.0",
    "category": "storage",
    "result_type_url": "type.googleapis.com/hal.modules.emmc.Result",
    "config_type_url": "type.googleapis.com/hal.modules.emmc.Config",
    "source_path": "",
    "modes": [
      "single_shot",
      "long_run"
    ],
    "tests": [
      {
        "id": "emmc_availability",
        "name": "Emmc Availability",
        "description": "HAL test case emmc_availability from the eMMC Storage module.",
        "modes": [
          "single_shot",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "can_bus",
    "name": "CAN Bus",
    "description": "CAN bus communication and error testing",
    "version": "1.0.0",
    "category": "serial_bus",
    "result_type_url": "type.googleapis.com/hal.modules.can_bus.Result",
    "config_type_url": "type.googleapis.com/hal.modules.can_bus.Config",
    "source_path": "",
    "modes": [
      "single_shot",
      "long_run",
      "monitoring",
      "event"
    ],
    "tests": [
      {
        "id": "can_bus_availability",
        "name": "Can Bus Availability",
        "description": "HAL test case can_bus_availability from the CAN Bus module.",
        "modes": [
          "single_shot",
          "long_run",
          "monitoring",
          "event"
        ]
      }
    ]
  },
  {
    "id": "rs485",
    "name": "RS-485",
    "description": "RS-485 half-duplex serial bus testing",
    "version": "1.0.0",
    "category": "serial_bus",
    "result_type_url": "type.googleapis.com/hal.modules.rs485.Result",
    "config_type_url": "type.googleapis.com/hal.modules.rs485.Config",
    "source_path": "",
    "modes": [
      "single_shot",
      "long_run"
    ],
    "tests": [
      {
        "id": "rs485_availability",
        "name": "Rs485 Availability",
        "description": "HAL test case rs485_availability from the RS-485 module.",
        "modes": [
          "single_shot",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "analog_input",
    "name": "Analog Input (ADC)",
    "description": "ADC analog input measurement and linearity testing",
    "version": "1.0.0",
    "category": "io",
    "result_type_url": "type.googleapis.com/hal.modules.analog_input.Result",
    "config_type_url": "type.googleapis.com/hal.modules.analog_input.Config",
    "source_path": "",
    "modes": [
      "single_shot",
      "monitoring",
      "event"
    ],
    "tests": [
      {
        "id": "analog_input_availability",
        "name": "Analog Input Availability",
        "description": "HAL test case analog_input_availability from the Analog Input (ADC) module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event"
        ]
      }
    ]
  },
  {
    "id": "pwm_output",
    "name": "PWM Output",
    "description": "PWM output frequency and duty cycle testing",
    "version": "1.0.0",
    "category": "io",
    "result_type_url": "type.googleapis.com/hal.modules.pwm_output.Result",
    "config_type_url": "type.googleapis.com/hal.modules.pwm_output.Config",
    "source_path": "",
    "modes": [
      "single_shot",
      "long_run"
    ],
    "tests": [
      {
        "id": "pwm_output_availability",
        "name": "Pwm Output Availability",
        "description": "HAL test case pwm_output_availability from the PWM Output module.",
        "modes": [
          "single_shot",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "sd_card",
    "name": "SD Card",
    "description": "SD card read/write performance and reliability testing",
    "version": "1.0.0",
    "category": "storage",
    "result_type_url": "type.googleapis.com/hal.modules.sd_card.Result",
    "config_type_url": "type.googleapis.com/hal.modules.sd_card.Config",
    "source_path": "",
    "modes": [
      "single_shot",
      "long_run"
    ],
    "tests": [
      {
        "id": "sd_card_availability",
        "name": "Sd Card Availability",
        "description": "HAL test case sd_card_availability from the SD Card module.",
        "modes": [
          "single_shot",
          "long_run"
        ]
      }
    ]
  },
  {
    "id": "bluetooth",
    "name": "Bluetooth",
    "description": "Bluetooth radio and pairing testing",
    "version": "1.0.0",
    "category": "networking",
    "result_type_url": "type.googleapis.com/hal.modules.bluetooth.Result",
    "config_type_url": "type.googleapis.com/hal.modules.bluetooth.Config",
    "source_path": "",
    "modes": [
      "single_shot",
      "monitoring"
    ],
    "tests": [
      {
        "id": "bluetooth_availability",
        "name": "Bluetooth Availability",
        "description": "HAL test case bluetooth_availability from the Bluetooth module.",
        "modes": [
          "single_shot",
          "monitoring"
        ]
      }
    ]
  },
  {
    "id": "mipi_csi",
    "name": "MIPI CSI Camera Interface",
    "description": "MIPI CSI-2 camera lane and signal testing",
    "version": "1.0.0",
    "category": "media",
    "result_type_url": "type.googleapis.com/hal.modules.mipi_csi.Result",
    "config_type_url": "type.googleapis.com/hal.modules.mipi_csi.Config",
    "source_path": "",
    "modes": [
      "single_shot",
      "monitoring"
    ],
    "tests": [
      {
        "id": "mipi_csi_availability",
        "name": "Mipi Csi Availability",
        "description": "HAL test case mipi_csi_availability from the MIPI CSI Camera Interface module.",
        "modes": [
          "single_shot",
          "monitoring"
        ]
      }
    ]
  },
  {
    "id": "mipi_dsi",
    "name": "MIPI DSI Display Interface",
    "description": "MIPI DSI display lane and signal testing",
    "version": "1.0.0",
    "category": "media",
    "result_type_url": "type.googleapis.com/hal.modules.mipi_dsi.Result",
    "config_type_url": "type.googleapis.com/hal.modules.mipi_dsi.Config",
    "source_path": "",
    "modes": [
      "single_shot",
      "monitoring"
    ],
    "tests": [
      {
        "id": "mipi_dsi_availability",
        "name": "Mipi Dsi Availability",
        "description": "HAL test case mipi_dsi_availability from the MIPI DSI Display Interface module.",
        "modes": [
          "single_shot",
          "monitoring"
        ]
      }
    ]
  },
  {
    "id": "accelerometer",
    "name": "Accelerometer",
    "description": "Accelerometer sensor calibration and range testing",
    "version": "1.0.0",
    "category": "sensors",
    "result_type_url": "type.googleapis.com/hal.modules.accelerometer.Result",
    "config_type_url": "type.googleapis.com/hal.modules.accelerometer.Config",
    "source_path": "",
    "modes": [
      "single_shot",
      "monitoring",
      "event"
    ],
    "tests": [
      {
        "id": "accelerometer_availability",
        "name": "Accelerometer Availability",
        "description": "HAL test case accelerometer_availability from the Accelerometer module.",
        "modes": [
          "single_shot",
          "monitoring",
          "event"
        ]
      }
    ]
  }
] satisfies HalModuleCatalogEntry[];
