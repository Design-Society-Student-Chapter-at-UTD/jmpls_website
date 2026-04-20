import type { Config } from "vike/types";
import vikeReact from "vike-react/config";
import logoUrl from "../assets/logo.jpeg";

// Default config (can be overridden by pages)
// https://vike.dev/config

const config: Config = {
  // https://vike.dev/head-tags
  title: "John Marshall Pre-Law Society at UT Dallas",
  description: "Official website of JMPLS at UT Dallas",
  favicon: logoUrl,
  extends: [vikeReact],
};

export default config;
