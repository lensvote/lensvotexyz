import {
  ApolloClient,
  ApolloLink,
  from,
  fromPromise,
  HttpLink,
  InMemoryCache,
  toPromise,
} from "@apollo/client"
import { RetryLink } from "@apollo/client/link/retry"
import axios from "axios"
import { parseJwt } from "@lib/parseJwt"
import { API_URL, LENSVOTE_API_URL, LV_KEYS } from "@data/constants"
import result from "lens"

const REFRESH_AUTHENTICATION_MUTATION = `
  mutation Refresh($request: RefreshRequest!) {
    refresh(request: $request) {
      accessToken
      refreshToken
    }
  }
`

const httpLink = new HttpLink({
  uri: API_URL,
  fetchOptions: "no-cors",
  fetch,
})

const lensvoteHttpLink = new HttpLink({
  uri: LENSVOTE_API_URL,
  fetchOptions: "no-cors",
  fetch,
})

// RetryLink is a link that retries requests based on the status code returned.
const retryLink = new RetryLink({
  delay: {
    initial: 100,
  },
  attempts: {
    max: 2,
    retryIf: (error) => Boolean(error),
  },
})

const clearStorage = () => {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
  localStorage.removeItem(LV_KEYS.STORE)
}

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = localStorage.getItem("accessToken")

  if (!accessToken || accessToken === "undefined") {
    clearStorage()
    return forward(operation)
  }

  const expiringSoon = Date.now() >= parseJwt(accessToken)?.exp * 1000

  if (!expiringSoon) {
    operation.setContext({
      headers: {
        "x-access-token": accessToken ? `Bearer ${accessToken}` : "",
      },
    })

    return forward(operation)
  }

  return fromPromise(
    axios(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({
        operationName: "Refresh",
        query: REFRESH_AUTHENTICATION_MUTATION,
        variables: {
          request: { refreshToken: localStorage.getItem("refreshToken") },
        },
      }),
    })
      .then(({ data }) => {
        const accessToken = data?.data?.refresh?.accessToken
        const refreshToken = data?.data?.refresh?.refreshToken
        operation.setContext({
          headers: {
            "x-access-token": `Bearer ${accessToken}`,
          },
        })

        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("refreshToken", refreshToken)

        return toPromise(forward(operation))
      })
      .catch(() => {
        return toPromise(forward(operation))
      }),
  )
})

const cache = new InMemoryCache({
  possibleTypes: result.possibleTypes,
})

export const client = new ApolloClient({
  link: ApolloLink.split(
    (operation) => {
      // If no clientName specify, use lens api otherwise we use lensvote on thegraph
      return !operation.getContext().clientName
    },
    from([retryLink, authLink, httpLink]),
    // Fallback
    lensvoteHttpLink,
  ),
  cache,
})

export const serverlessClient = new ApolloClient({
  link: from([httpLink]),
  cache,
})
