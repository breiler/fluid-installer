const config = "board: 6 Pack\r\
name: 6 Pack External XYZ HBridgeSpindle\r\
meta:\r\
\r\
stepping:\r\
  engine: I2S_STREAM\r\
  idle_ms: 250\r\
  pulse_us: 4\r\
  dir_delay_us: 1\r\
  disable_delay_us: 0\r\
  \r\
axes:\r\
  shared_stepper_disable_pin: NO_PIN\r\
  x:\r\
    steps_per_mm: 100.000\r\
    max_rate_mm_per_min: 5000.000\r\
    acceleration_mm_per_sec2: 50.000\r\
    max_travel_mm: 300.000\r\
    soft_limits: false\r\
    homing:\r\
      cycle: 2\r\
      positive_direction: false\r\
      mpos_mm: 0.000\r\
      feed_mm_per_min: 100.000\r\
      seek_mm_per_min: 200.000\r\
      settle_ms: 500\r\
      seek_scaler: 1.100\r\
      feed_scaler: 1.100\r\
      \r\
    motor0:\r\
      limit_neg_pin: NO_PIN\r\
      limit_pos_pin: NO_PIN\r\
      limit_all_pin: NO_PIN\r\
      hard_limits: false\r\
      pulloff_mm: 1.000\r\
      stepstick:\r\
        ms3_pin: i2so.3\r\
        step_pin: I2SO.2\r\
        direction_pin: I2SO.1\r\
        disable_pin: I2SO.0\r\
        \r\
  y:\r\
    steps_per_mm: 100.000\r\
    max_rate_mm_per_min: 5000.000\r\
    acceleration_mm_per_sec2: 50.000\r\
    max_travel_mm: 300.000\r\
    soft_limits: false\r\
    homing:\r\
      cycle: 2\r\
      positive_direction: true\r\
      mpos_mm: 0.000\r\
      feed_mm_per_min: 100.000\r\
      seek_mm_per_min: 200.000\r\
      settle_ms: 500\r\
      seek_scaler: 1.100\r\
      feed_scaler: 1.100\r\
      \r\
    motor0:\r\
      limit_neg_pin: NO_PIN\r\
      limit_pos_pin: NO_PIN\r\
      limit_all_pin: NO_PIN\r\
      hard_limits: false\r\
      pulloff_mm: 1.000\r\
      stepstick:\r\
        ms3_pin: i2so.6\r\
        step_pin: I2SO.5\r\
        direction_pin: I2SO.4\r\
        disable_pin: I2SO.7\r\
        \r\
  z:\r\
    steps_per_mm: 100.000\r\
    max_rate_mm_per_min: 5000.000\r\
    acceleration_mm_per_sec2: 50.000\r\
    max_travel_mm: 300.000\r\
    soft_limits: false\r\
    homing:\r\
      cycle: 2\r\
      positive_direction: true\r\
      mpos_mm: 0.000\r\
      feed_mm_per_min: 100.000\r\
      seek_mm_per_min: 200.000\r\
      settle_ms: 500\r\
      seek_scaler: 1.100\r\
      feed_scaler: 1.100\r\
      \r\
    motor0:\r\
      limit_neg_pin: NO_PIN\r\
      limit_pos_pin: NO_PIN\r\
      limit_all_pin: NO_PIN\r\
      hard_limits: false\r\
      pulloff_mm: 1.000\r\
      standard_stepper:\r\
        step_pin: I2SO.10\r\
        direction_pin: I2SO.9\r\
        disable_pin: I2SO.8\r\
        \r\
i2so:\r\
  bck_pin: gpio.22\r\
  data_pin: gpio.21\r\
  ws_pin: gpio.17\r\
  \r\
spi:\r\
  miso_pin: gpio.19\r\
  mosi_pin: gpio.23\r\
  sck_pin: gpio.18\r\
  \r\
sdcard:\r\
  card_detect_pin: NO_PIN\r\
  cs_pin: gpio.5\r\
  \r\
HBridgeSpindle:\r\
  pwm_hz: 5000\r\
  output_cw_pin: gpio.4\r\
  output_ccw_pin: gpio.16\r\
  enable_pin: gpio.26\r\
  disable_with_s0: false\r\
  spinup_ms: 0\r\
  spindown_ms: 0\r\
  tool_num: 100\r\
  speed_map: 0=0.000% 10000=100.000%\r\
";

export default config;
