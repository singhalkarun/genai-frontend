import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, from } from '@apollo/client';

const httpLink = createHttpLink({
    uri: 'http://65.0.223.215:8080/v1/graphql',
});

const authLink = new ApolloLink((operation, forward) => {
    // Retrieve your Hasura admin secret or access key from a secure location
    // const token = 'YOUR_HASURA_AUTH_TOKEN';
    
    // Add the x-hasura-admin-secret header to the GraphQL operation
    operation.setContext({
        headers: {
            'x-hasura-admin-secret': 'GenAi@Contlo',
        },
    });
    
    // Proceed to the next middleware in the chain
    return forward(operation);
});

const apolloClient = new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
});

export default apolloClient;
