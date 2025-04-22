import "@saleor/macaw-ui/style";
import "../styles/globals.css";

import { AppBridge, AppBridgeProvider } from "@saleor/app-sdk/app-bridge";
import { RoutePropagator } from "@saleor/app-sdk/app-bridge/next";
import { ThemeProvider } from "@saleor/macaw-ui";
import { AppProps } from "next/app";

import { GraphQLProvider } from "../providers/GraphQLProvider";
import { NoSSRWrapper } from "../lib/no-ssr-wrapper";

/**
 * Ensure instance is a singleton.
 * TODO: This is React 18 issue, consider hiding this workaround inside app-sdk
 */
const appBridgeInstance = typeof window !== "undefined" ? new AppBridge() : undefined;

/**
 * That's a hack required by Macaw-UI incompatibility with React 18
 */
function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="defaultLight">
      {children}
    </ThemeProvider>
  );
}

function SaleorApp({ Component, pageProps }: AppProps) {
  return (
    <NoSSRWrapper>
      <AppBridgeProvider appBridgeInstance={appBridgeInstance}>
        <GraphQLProvider>
          <ThemeProviderWrapper>
            <RoutePropagator />
            <Component {...pageProps} />
          </ThemeProviderWrapper>
        </GraphQLProvider>
      </AppBridgeProvider>
    </NoSSRWrapper>
  );
}

export default SaleorApp;
