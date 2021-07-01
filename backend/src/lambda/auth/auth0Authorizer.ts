import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify} from 'jsonwebtoken'
import { JwtPayload } from '../../auth/JwtPayload'


const certificate = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJAOsUWM7Ms/YTMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi02aWNyMWQwMC51cy5hdXRoMC5jb20wHhcNMjAwODMwMTIyOTM0WhcN
MzQwNTA5MTIyOTM0WjAkMSIwIAYDVQQDExlkZXYtNmljcjFkMDAudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq9QQFFJW7UuA69G1
vnkyS+nBI55i5Ae5lJBxio4znVbKLiWFr4PnMFfrpEnHpUqvHYDaSoFVcvOaTrxs
+ZoF5r2lVLbhdXpGNT+7r0PXT+/SW7oPo5lBThPIUjwCsB+pv58tsVRfaL4KGWUR
WLQKlm5aW54e6GOoXQ5nNyhEiv4J9dVd935gPYrVXrR61eOH2xqlWvJO+hoOPFgX
pb6flsYYLuL/zbR7Tzm7djpxjfIhIlDTp3pbVj6NwUxO1rN0mTNVSfP5g5RSecH6
2p4uGxkuB1mOV2kyBEnvX6yI1cWKHU5Des4QpRGhmGwclKiokCy8FORXgFEka2V8
F8Y1QQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSKCs219ElE
Kzd8SvCPjadZBp0NBTAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AG8vm4TO44EsdwzqdozFxMViCZJJaonlXjjRYahhniDsAQ2F72sCrA4YDatZSRAG
2XZd3tnOA2B2c7SywKyrGufY8K0W7qRYaBNqoOLpkJ4R+GVxba1F4srnoFXfUGWs
87+IIF/6DBmPTR0Kf/kHOk/DW4aIc9j80n+lkQx001W/s+WKg95AluxFVDZl4Jwb
AFewHWw55xVooLZw1EQ2rCX6exb2pHLM/6FO7zCDATNYJ7cBHtypoxjtGXl5SorH
mz2jMlVKSOMjhJP9JewnsQSt7jaGSnknJVMwcRTTQXqUeQqN8n4GucbcI53VCYrJ
fx+OeEXCTMSX9tTIEE2KjY4=
-----END CERTIFICATE-----`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)

  return verify(token,certificate,{ algorithms: ['RS256']}) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

