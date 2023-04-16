import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const wsLink =
    typeof window !== "undefined"
        ? new GraphQLWsLink(
                createClient({
                    url: "ws://65.0.223.215:8080/v1/graphql",
                    connectionParams: {
                        headers: {
                            'x-hasura-admin-secret':'GenAi@Contlo' 
                        }
                    }
                    
                })
          )
        : null;

const httpLink = new HttpLink({
    uri: `http://65.0.223.215:8080/v1/graphql`,
    headers: {
        'x-hasura-admin-secret':'GenAi@Contlo'
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

export default client;
