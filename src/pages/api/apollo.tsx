import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const getClient = (hasuraBaseUrl: string, hasuraAdminSecret: string) => {
    const wsLink =
    typeof window !== "undefined"
        ? new GraphQLWsLink(
                createClient({
                    url: `wss://${hasuraBaseUrl}/v1/graphql`,
                    connectionParams: {
                        headers: {
                            'x-hasura-admin-secret': hasuraAdminSecret
                        }
                    }
                    
                })
          )
        : null;

const httpLink = new HttpLink({
    uri: `https://${hasuraBaseUrl}/v1/graphql`,
    headers: {
        'x-hasura-admin-secret': hasuraAdminSecret
    }
});

const link =
    typeof window !== "undefined" && wsLink != null
        ? split(
                ({ query }) => {
                    const def = getMainDefinition(query);
                    return (
                        def.kind === "OperationDefinition" &&
                        def.operation === "subscription"
                    );
                },
                wsLink,
                httpLink
          )
        : httpLink;

const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
}); 

return client
}

export default getClient;
