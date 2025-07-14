/** @jest-config-loader ts-node */
import type {Config} from 'jest';

// jest requires ts-node for typescript

const config: Config = {
	preset: "ts-jest",
  verbose: true,
	transform: {},
	extensionsToTreatAsEsm: [".ts"]
	
};

export default config;