import { config } from "@repo/eslint-config/react-internal";
import reactRefresh from "eslint-plugin-react-refresh";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  reactRefresh.configs.vite,
  {
    files: ["src/components/ui/**"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  {
    ignores: ["dist/**"],
  },
];
