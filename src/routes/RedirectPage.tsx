import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gql, useMutation, useLazyQuery } from "@apollo/client";
import LoaderWheel from "../components/LoaderWheel";

const RedirectPage = () => {
    const navigate = useNavigate();

    const token: string | null = localStorage.getItem("jwtToken");
    const queryParameters = new URLSearchParams(window.location.search);
  
    const scope = queryParameters.get("scope");
    const code = queryParameters.get("code");

    const [exchangeStrava, { loading }] = useMutation(EXCHANGE_STRAVA, {
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        onCompleted() {
          navigate("/app/profile");
        },
        onError(err) {
          console.log(err)
          navigate("/");
        },
    });

    // strava query
    const redirectToExternalLink = (link: string) => {
        window.location.href = link;
    };
    const [requestStravaAuthorization ,{ loading: stravaLoading, error: stravaErr, data: stravaData }] = useLazyQuery(REQUEST_STRAVA, {
        context: {
            headers: {
                // Your headers go here
                Authorization: `Bearer ${token}`, // Example for authorization header
            },
            },
        onCompleted() {
            redirectToExternalLink(stravaData.requestStravaAuthorization)
        },
        onError: (error) => {
            console.log(error)
            console.error("GraphQL Mutation Error:", error);
            console.log("GraphQL Errors:", error.graphQLErrors);

        },
    });

    useEffect(() => {
      if (code && scope) {
        exchangeStrava({
          variables: { code, scope },
        });
      }
      else {
        requestStravaAuthorization();
      }
    }, [code, scope, exchangeStrava]);

    return (
        <div className="landing-page-main-container" >
            <LoaderWheel />
        </div>
    )
};

const EXCHANGE_STRAVA = gql`
mutation exchangeStravaAuthorizationCode(
    $code: String!
    $scope: String!
  ) {
    exchangeStravaAuthorizationCode(
        code: $code
        scope: $scope
    ) {
        username
    }
  }
`;

const REQUEST_STRAVA = gql`
  query requestStravaAuthorization {
    requestStravaAuthorization
  }
`;


export default RedirectPage;