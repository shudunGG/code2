# Security Assessment

## Scope and Limitations
Large portions of the source code (for example the `mcp-index` portal and `user-center` modules) are stored as Git LFS pointers in this repository, so their real contents were unavailable in the local working copy. As a result, the assessment below focuses on the unpacked deployment artifacts that are actually present in the tree. 【F:大数据基座/数字政府张掖市大数据平台基座项目源代码/mcp-index-对接门户代码.zip†L1-L3】【F:大数据基座/数字政府张掖市大数据平台基座项目源代码/user-center.zip†L1-L3】

## High-Risk Findings

### 1. Plaintext production database root credentials
* **Where:** `DCockpit.war/WEB-INF/classes/jdbc.properties`
* **What:** The file ships with a MySQL connection string that uses the `root` account together with the plaintext password `Infra5@Gep0int`.
* **Risk:** Anyone who can read the deployment bundle obtains administrative access to the database server, enabling complete data compromise or destructive operations. Using `root` from an application also bypasses least-privilege practices.
* **Evidence:** `username=root` and `password=Infra5@Gep0int` are hard-coded in the configuration. 【F:大数据基座/部署包/DCockpit.war/WEB-INF/classes/jdbc.properties†L1-L45】
* **Recommendation:** Provision a dedicated, least-privilege database account for the application, store its credentials via a secure secret-management mechanism, and rotate the exposed password immediately.

### 2. Embedded RSA private key material
* **Where:** `DCockpit.war/WEB-INF/__RSA_PAIR.txt` (and similar bundles such as `dxpmanager/WEB-INF/__RSA_PAIR.txt`).
* **What:** The deployment packages include serialized RSA key pairs that contain both the public and private key components.
* **Risk:** If these keys are used for TLS, signing, or license enforcement, shipping the private key inside the WAR allows any party with package access to impersonate the service or decrypt confidential traffic.
* **Evidence:** The serialized object stream contains `java.security.KeyPair` with embedded `JCERSAPrivateKey` and modulus/private exponent data. 【F:大数据基座/部署包/DCockpit.war/WEB-INF/__RSA_PAIR.txt†L1-L23】【F:大数据基座/部署包/dxpmanager/WEB-INF/__RSA_PAIR.txt†L1-L23】
* **Recommendation:** Remove private keys from the artifact, generate fresh key pairs, and load secrets securely (for example from a keystore protected by environment-specific credentials).

### 3. Cross-origin resource sharing (CORS) misconfiguration with credentials
* **Where:** `DCockpit.war/WEB-INF/web.xml`
* **What:** The configured `CORSFilter` allows any origin (`*`) while also enabling `cors.supportsCredentials=true`.
* **Risk:** Browsers will send authenticated requests from any arbitrary site, enabling cross-site request forgery and cross-origin data exfiltration when a victim is logged in.
* **Evidence:** The filter initialization parameters set `cors.allowOrigin` to `*` and `cors.supportsCredentials` to `true`. 【F:大数据基座/部署包/DCockpit.war/WEB-INF/web.xml†L41-L90】
* **Recommendation:** Restrict allowed origins to trusted domains, or disable credentialed requests; consider relying on Spring’s `CorsConfiguration` with explicit allowlists.

### 4. Exposed Druid monitoring console with reset privileges
* **Where:** `DCockpit.war/WEB-INF/web.xml`
* **What:** The `DruidStatView` servlet is mapped to `/druid/*` with `resetEnable=true` and no login credentials defined.
* **Risk:** Attackers can access query statistics and reset the connection pool remotely, which can leak sensitive SQL, credentials, or disrupt service availability. Without authentication the console is effectively public.
* **Evidence:** The servlet mapping exposes `/druid/*` and enables the reset feature without specifying `loginUsername`/`loginPassword`. 【F:大数据基座/部署包/DCockpit.war/WEB-INF/web.xml†L160-L212】
* **Recommendation:** Protect the Druid console behind authentication and internal network controls, or remove it entirely from production deployments.

### 5. Built-in diagnostic servlet with default `admin/admin` credentials
* **Where:** `DCockpit.war/WEB-INF/web.xml`
* **What:** The `CheckServlet` is deployed at `/autocheck/*` and configured with the static username/password `admin/admin`.
* **Risk:** Attackers can authenticate with default credentials and access diagnostic endpoints that typically expose configuration, environment, or file access features.
* **Evidence:** The servlet init parameters configure both `loginUsername` and `loginPassword` as `admin`. 【F:大数据基座/部署包/DCockpit.war/WEB-INF/web.xml†L308-L417】
* **Recommendation:** Remove the diagnostic servlet from production or enforce strong, rotated credentials and network restrictions.

### 6. Hard-coded RabbitMQ and job scheduler secrets
* **Where:** `dxpmanager/WEB-INF/classes/spring/appcontext-rabbitmq.xml` and `dxpmanager/WEB-INF/classes/application.properties`
* **What:** The messaging configuration embeds the broker hostname with the shared username/password `epoint/epoint`, and the application properties expose the same credentials plus keystore passwords (`p@ssw0rd`) and an `xxl-job` access token (`abcdefg`).
* **Risk:** Anyone obtaining the package can connect to the messaging infrastructure or job scheduler, consume sensitive events, or submit malicious jobs.
* **Evidence:** The XML and properties files hard-code the credentials and tokens mentioned above. 【F:大数据基座/部署包/dxpmanager/WEB-INF/classes/spring/appcontext-rabbitmq.xml†L1-L93】【F:大数据基座/部署包/dxpmanager/WEB-INF/classes/application.properties†L1-L66】
* **Recommendation:** Externalize messaging and scheduler secrets to a secure vault, rotate the exposed values, and enforce per-environment credentials with least privilege.

## Additional Observations
* The `EpointSSOClient.properties` file still uses the placeholder client secret `admin`, which undermines SSO client authentication and should be replaced with a unique secret per deployment. 【F:大数据基座/部署包/DCockpit.war/WEB-INF/classes/EpointSSOClient.properties†L1-L152】
* Many other configuration files contain commented example credentials (for Oracle, SQL Server, MongoDB, etc.). While commented, ensure they are not accidentally enabled and avoid committing real secrets to source control.

## Recommended Next Steps
1. Rotate all exposed credentials (database, RabbitMQ, SSO, keystores, job tokens) immediately.
2. Remove private keys and default diagnostic endpoints from production artifacts.
3. Harden cross-origin and management endpoints, allowing access only from trusted origins/networks.
4. Introduce a secrets-management strategy so sensitive data is injected at deploy time instead of being committed to the repository.
5. Retrieve the missing Git LFS-managed modules and perform a follow-up security review once the actual sources are available.
