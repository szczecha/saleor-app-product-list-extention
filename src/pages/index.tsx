import { actions, useAppBridge } from "@saleor/app-sdk/app-bridge";
import { Box, Button, Input, Text } from "@saleor/macaw-ui";
import { NextPage } from "next";
import Link from "next/link";
import { MouseEventHandler, useEffect, useState } from "react";

const AddToSaleorForm = () => (
  <Box
    as={"form"}
    display={"flex"}
    alignItems={"center"}
    gap={4}
    onSubmit={(event) => {
      event.preventDefault();

      const saleorUrl = new FormData(event.currentTarget as HTMLFormElement).get("saleor-url");
      const manifestUrl = new URL("/api/manifest", window.location.origin);
      const redirectUrl = new URL(
        `/dashboard/apps/install?manifestUrl=${manifestUrl}`,
        saleorUrl as string
      ).href;

      window.open(redirectUrl, "_blank");
    }}
  >
    <Input type="url" required label="Saleor URL" name="saleor-url" />
    <Button type="submit">Add to Saleor</Button>
  </Box>
);

/**
 * This is page publicly accessible from your app.
 * You should probably remove it.
 */
const IndexPage: NextPage = () => {
  const { appBridgeState, appBridge } = useAppBridge();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLinkClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    /**
     * In iframe, link can't be opened in new tab, so Dashboard must be a proxy
     */
    if (appBridgeState?.ready) {
      e.preventDefault();

      appBridge?.dispatch(
        actions.Redirect({
          newContext: true,
          to: e.currentTarget.href,
        })
      );
    }
  };

  const isLocalHost = global.location.href.includes("localhost");

  const handleGoToProducts = () => {
    appBridge?.dispatch(
      actions.Redirect({
        to: "/products",
      })
    );
  };

  return (
    <Box padding={8}>
      <Text as="h1" marginBottom={6}>Product List Metadata Filter</Text>

      <Box marginBottom={8}>
        <Text as="h2" marginBottom={4}>About this app</Text>
        <Text as="p" marginBottom={2}>
          This app extends Saleor's product list functionality by adding metadata-based filtering capabilities. 
          It allows you to search for products based on their metadata key-value pairs.
        </Text>
      </Box>

      <Box marginBottom={8}>
        <Text as="h2" marginBottom={4}>Features</Text>
        <Box display="flex" flexDirection="column" gap={2}>
          <Text as="p">✨ Filter products by metadata key-value pairs</Text>
          <Text as="p">📄 Page-based suggestions - use your Pages as a source for metadata values (perfect for brand lists, categories, etc.)</Text>
          <Text as="p">🖼️ Visual product list with thumbnails</Text>
          <Text as="p">🔗 Quick access to product details</Text>
        </Box>
      </Box>

      <Box marginBottom={8}>
        <Text as="h2" marginBottom={4}>How to use</Text>
        <Box display="flex" flexDirection="column" gap={2}>
          <Text as="p">1. Go to the Products list in your dashboard</Text>
          <Text as="p">2. Click on "Filter Products by Metadata" in the actions menu</Text>
          <Text as="p">3. Enter a metadata key (default: "brand")</Text>
          <Text as="p">4. Type to see suggestions from your Pages or enter a custom value</Text>
          <Text as="p">5. Click "Search Products" to filter the list</Text>
        </Box>
      </Box>

      <Box marginBottom={8}>
        <Text as="h2" marginBottom={4}>Getting Started</Text>
        <Button onClick={handleGoToProducts}>
          Go to Products List
        </Button>
      </Box>

      <Box marginTop={12}>
        <Text as="h2" marginBottom={4}>Need help?</Text>
        <Box display="flex" flexDirection="column" gap={2}>
          <Text 
            as="a" 
            href="https://docs.saleor.io/docs/3.x/developer/metadata" 
            target="_blank"
            color="info1"
            onClick={handleLinkClick}
          >
            📚 Learn about Saleor Metadata
          </Text>
          <Text 
            as="a" 
            href="https://github.com/szczecha/saleor-app-product-list-extention" 
            target="_blank"
            color="info1"
            onClick={handleLinkClick}
          >
            💻 View source code
          </Text>
          <Text 
            as="a" 
            href="https://saleor.io/discord" 
            target="_blank"
            color="info1"
            onClick={handleLinkClick}
          >
            💬 Join our Discord community
          </Text>
        </Box>
      </Box>

      {mounted && !isLocalHost && !appBridgeState?.ready && (
        <>
          <Text marginBottom={4} as={"p"}>
            Install this app in your Dashboard and get extra powers!
          </Text>
          <AddToSaleorForm />
        </>
      )}
    </Box>
  );
};

export default IndexPage;
