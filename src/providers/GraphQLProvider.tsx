import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from "@apollo/client";
import { useAppBridge } from "@saleor/app-sdk/app-bridge";
import { PropsWithChildren } from "react";

export function GraphQLProvider({ children }: PropsWithChildren<{}>) {
  const { appBridgeState } = useAppBridge();

  const httpLink = createHttpLink({
    uri: appBridgeState?.saleorApiUrl,
    headers: {
      authorization: appBridgeState?.token ? `Bearer ${appBridgeState.token}` : "",
    },
  });

  const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
