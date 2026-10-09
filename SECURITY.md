# Security Policy

## Supported Versions

DeathEmpire is currently under active development. Security fixes are
provided for the latest code available on the `main` branch.

| Version | Supported |
| ------- | --------- |
| `main`  | ✅ Yes    |
| Older commits, tags, or forks | ❌ No |

Once versioned releases are published, this table will be updated to list
the supported release versions and their security-maintenance status.

## Reporting a Vulnerability

Please do not report security vulnerabilities through public GitHub issues,
pull requests, discussions, or any other public channel.

The preferred reporting method is GitHub Private Vulnerability Reporting:

1. Open the repository's **Security** tab.
2. Select **Report a vulnerability**.
3. Include the information requested in the report form.

If Private Vulnerability Reporting is unavailable, contact the repository
maintainers through the private contact method listed in the repository
settings or organization profile. Do not include secrets or exploit details
in a public issue while requesting contact.

### What to Include

Please provide, when possible:

- A clear description of the vulnerability.
- The affected component, endpoint, workflow, or configuration.
- The affected commit, branch, or release.
- Reproduction steps or a minimal proof of concept.
- The potential security impact.
- Any required permissions, credentials, or deployment conditions.
- A suggested mitigation or fix, if available.

Please redact passwords, API keys, tokens, private URLs, personal data, and
other secrets from the report. Do not test against systems or data that you
do not own or have permission to access.

### Response Process

We will try to:

- Acknowledge receipt within 3 business days.
- Assess the report and provide an initial response within 7 business days.
- Keep the reporter informed as the investigation progresses.
- Coordinate the fix and disclosure timeline with the reporter when
  appropriate.
- Credit the reporter in the security advisory or release notes, unless
  anonymity is requested.

Response times may be longer during periods of limited maintainer
availability.

### Disclosure

Please allow the maintainers reasonable time to investigate and address a
confirmed vulnerability before public disclosure.

After a fix is available, the maintainers may publish a GitHub Security
Advisory, release note, or other security notice containing the affected
versions, impact, remediation, and credit information.

### Scope

Reports are especially valuable for:

- Authentication and authorization issues.
- Exposure of secrets or private data.
- Supabase Edge Functions and backend integrations.
- HMAC, identity, rate-limiting, and idempotency logic.
- Server-side request handling.
- GitHub Actions and deployment workflows.
- Vulnerabilities that allow unintended modification of game or service data.

Reports about general bugs, feature requests, performance issues, or
non-security problems should be opened as regular GitHub issues.
