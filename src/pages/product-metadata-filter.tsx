import { actions, useAppBridge } from "@saleor/app-sdk/app-bridge";
import { Box, Button, Input, Text, Spinner } from "@saleor/macaw-ui";
import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import type { PageListQuery, ProductsByMetadataQuery } from "../../generated/graphql";
import { PageListDocument, ProductsByMetadataDocument } from "../../generated/graphql";

// Local storage key for persisting search state
const STORAGE_KEY = "product-metadata-filter-state";

interface StoredState {
  metadataKey: string;
  metadataValue: string;
  isSearching: boolean;
  lastSearchTimestamp: number;
}

interface ProductNode {
  id: string;
  name: string;
  thumbnail?: {
    url: string;
  } | null;
}

const ProductMetadataFilter = () => {
  const { appBridge } = useAppBridge();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [metadataKey, setMetadataKey] = useState("brand-type");
  const [metadataValue, setMetadataValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState) as StoredState;
        // Only restore state if it's less than 1 hour old
        if (Date.now() - parsed.lastSearchTimestamp < 3600000) {
          setMetadataKey(parsed.metadataKey);
          setMetadataValue(parsed.metadataValue);
          setIsSearching(parsed.isSearching);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error("Error loading saved state:", error);
    }
  }, []);

  // Save state when it changes
  useEffect(() => {
    if (isSearching) {
      const stateToSave: StoredState = {
        metadataKey,
        metadataValue,
        isSearching,
        lastSearchTimestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }
  }, [metadataKey, metadataValue, isSearching]);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Query for pages
  const { data: pagesData, loading: pagesLoading } = useQuery<PageListQuery>(PageListDocument, {
    fetchPolicy: "cache-first"
  });

  // Filter page titles based on input value
  const filteredTitles = useMemo(() => {
    if (!pagesData?.pages?.edges || !metadataValue) return [];
    
    return pagesData.pages.edges
      .map(({ node }) => node.title)
      .filter((title: string) => 
        title.toLowerCase().includes(metadataValue.toLowerCase())
      );
  }, [pagesData, metadataValue]);

  const { data, loading: productsLoading, error } = useQuery<ProductsByMetadataQuery>(ProductsByMetadataDocument, {
    variables: {
      first: 20,
      key: metadataKey,
      value: metadataValue
    },
    skip: !isSearching
  });

  if (pagesLoading) {
    return (
      <Box padding={8} display="flex" alignItems="center" justifyContent="center">
        <Spinner />
      </Box>
    );
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSearching(true);
  };

  const handleProductClick = (productId: string) => {
    appBridge?.dispatch(
      actions.Redirect({
        to: `/products/${productId}`,
        newContext: true,
      })
    );
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetadataValue(e.target.value);
    setIsDropdownOpen(true);
    setIsSearching(false); // Reset search when value changes
  };

  const handleValueSelect = (title: string) => {
    setMetadataValue(title);
    setIsDropdownOpen(false);
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetadataKey(e.target.value);
    setIsSearching(false); // Reset search when key changes
  };

  return (
    <Box padding={8}>
      <Text as="h1" marginBottom={4}>Add Metadata Filter</Text>
      <Box
        as="form"
        display="flex"
        flexDirection="column"
        gap={4}
        onSubmit={handleSubmit}
      >
        <Input
          label="Metadata Key"
          value={metadataKey}
          onChange={handleKeyChange}
          required
          disabled={productsLoading}
        />
        <Box position="relative" ref={dropdownRef}>
          <Input
            label="Metadata Value"
            value={metadataValue}
            onChange={handleValueChange}
            onFocus={() => setIsDropdownOpen(true)}
            required
            disabled={productsLoading}
          />
          {isDropdownOpen && filteredTitles.length > 0 && metadataValue && (
            <Box
              position="absolute"
              style={{
                top: "100%",
                left: 0,
                right: 0,
                backgroundColor: "#fff",
                borderRadius: "4px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                zIndex: 1000,
                maxHeight: "200px",
                overflowY: "auto"
              }}
            >
              {filteredTitles.map((title: string) => (
                <Box
                  key={title}
                  padding={2}
                  onClick={() => handleValueSelect(title)}
                  style={{ 
                    cursor: "pointer",
                    backgroundColor: "#fff",
                    transition: "background-color 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "#f4f4f4";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "#fff";
                  }}
                >
                  <Text color="default2">{title}</Text>
                </Box>
              ))}
            </Box>
          )}
        </Box>
        <Button 
          type="submit" 
          disabled={productsLoading || !metadataKey || !metadataValue}
        >
          {productsLoading ? "Searching..." : "Search Products"}
        </Button>
      </Box>

      {productsLoading && (
        <Box marginTop={4} display="flex" alignItems="center" justifyContent="center">
          <Spinner />
        </Box>
      )}
      
      {error && (
        <Box marginTop={4} padding={4} style={{ backgroundColor: "#fff4f4", borderRadius: "4px" }}>
          <Text>Error: {error.message}</Text>
        </Box>
      )}
      
      {data?.products && !productsLoading && (
        <Box marginTop={4}>
          <Text marginBottom={2}>Found {data.products.totalCount} products</Text>
          <Box display="flex" flexDirection="column" gap={2}>
            {data.products.edges.map(({ node }) => (
              <Box 
                key={node.id}
                padding={2}
                onClick={() => handleProductClick(node.id)}
                style={{ 
                  cursor: "pointer",
                  backgroundColor: "#fff",
                  borderRadius: 4,
                  border: "1px solid #eee",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#f4f4f4";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#fff";
                }}
              >
                <Box display="flex" alignItems="center" gap={4}>
                  {node.thumbnail?.url ? (
                    <Box
                      width={10}
                      height={10}
                      borderRadius={4}
                      overflow="hidden"
                    >
                      <img 
                        src={node.thumbnail.url} 
                        alt={node.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />
                    </Box>
                  ) : (
                    <Box 
                      width={10}
                      height={10}
                      backgroundColor="transparent"
                      borderRadius={4}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text color="inherit">No image</Text>
                    </Box>
                  )}
                  <Text>
                    {node.name} (ID: {node.id})
                  </Text>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ProductMetadataFilter; 