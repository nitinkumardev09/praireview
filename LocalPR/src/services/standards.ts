export interface ReviewStandard {
    id: string;
    name: string;
    category: 'security' | 'performance' | 'quality' | 'testing' | 'architecture';
    description: string;
    enabled: boolean;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
}

export const DEFAULT_STANDARDS: ReviewStandard[] = [
    {
        id: 'sec-injection',
        name: 'Injection & Sanitization',
        category: 'security',
        description: 'Detect SQL injection, Command injection, Path Traversal, and XSS risks.',
        enabled: true,
        severity: 'CRITICAL'
    },
    {
        id: 'sec-secrets',
        name: 'Hardcoded Secrets & Tokens',
        category: 'security',
        description: 'Identify hardcoded API keys, JWT secrets, passwords, or connection strings in code.',
        enabled: true,
        severity: 'CRITICAL'
    },
    {
        id: 'perf-async',
        name: 'Async & Concurrency Bottlenecks',
        category: 'performance',
        description: 'Check for blocking calls, unhandled Promise rejections, missing cancellation tokens in .NET/Java.',
        enabled: true,
        severity: 'HIGH'
    },
    {
        id: 'perf-memory',
        name: 'Resource Leaks & Event Listeners',
        category: 'performance',
        description: 'Detect missing IDisposable/AutoCloseable cleanup, lingering event listeners, unclosed streams.',
        enabled: true,
        severity: 'HIGH'
    },
    {
        id: 'qual-null',
        name: 'Null Safety & Defensive Checks',
        category: 'quality',
        description: 'Enforce optional chaining, null checks, proper exception handling without empty catch blocks.',
        enabled: true,
        severity: 'MEDIUM'
    },
    {
        id: 'qual-clean',
        name: 'Clean Code & SOLID Principles',
        category: 'architecture',
        description: 'Verify single responsibility, sensible abstraction layers, and readability.',
        enabled: true,
        severity: 'MEDIUM'
    },
    {
        id: 'test-coverage',
        name: 'Test Coverage & Assertions',
        category: 'testing',
        description: 'Ensure new business logic, endpoints, and mutations include corresponding unit/integration tests.',
        enabled: true,
        severity: 'HIGH'
    },
    {
        id: 'type-safety',
        name: 'Strict Type Safety',
        category: 'quality',
        description: 'Flag any implicit any, unsafe type casting, or raw dynamic object access without validation.',
        enabled: true,
        severity: 'LOW'
    }
];

export interface MarkdownStandard {
    id: string;
    name: string;
    filename: string;
    description: string;
    markdownContent: string;
}

export const PRESET_MARKDOWN_STANDARDS: MarkdownStandard[] = [
    {
        id: 'clean-code',
        name: 'Enterprise Clean Architecture & Code Standards',
        filename: 'ENTERPRISE_CLEAN_CODE.md',
        description: 'Enforces SOLID architecture, async/await cancellation token propagation, zero memory leaks, and >80% test coverage.',
        markdownContent: `# 📘 Enterprise Clean Code & Architecture Guidelines (v2.4)

## Section 1: Architecture & Modularity
- **RULE 1.1 (Separation of Concerns)**: Business domain logic must never directly access raw database contexts or HTTP contexts.
- **RULE 1.2 (Dependency Injection)**: Always program against interfaces (\`IOrderProcessingService\`, \`IPaymentGateway\`). Never instantiate concrete services with \`new\` inside controllers.

## Section 2: Asynchronous & Concurrency Standards
- **RULE 2.1 (Cancellation Tokens)**: Every asynchronous method in .NET C#, Java, or TypeScript that performs I/O or database queries must accept and forward a \`CancellationToken\` / context signal.
- **RULE 2.2 (Thread Pool Safety)**: Never block async code synchronously (e.g. avoid \`.Result\` or \`.Wait()\` in .NET; avoid synchronous file I/O in Node.js).

## Section 3: Data Access & Security
- **RULE 3.1 (Zero Raw SQL Interpolation)**: All database queries must use parameterized commands, ORM LINQ queries, or prepared statements. String interpolation in raw SQL is strictly prohibited.
- **RULE 3.2 (Zero Hardcoded Secrets)**: Passwords, API secrets, private keys, and connection strings must strictly be retrieved from environment variables, Azure KeyVault, or AWS Secrets Manager.

## Section 4: Testing & Coverage Policy
- **RULE 4.1 (PR Coverage Gate)**: At least 80% of lines modified or introduced in this Pull Request must have corresponding automated unit/integration test coverage.
- **RULE 4.2 (Failure Assertions)**: Unit tests must cover both the happy path and negative exception scenarios.
`
    },
    {
        id: 'owasp-security',
        name: 'OWASP Top 10 & Zero-Trust Security Standard',
        filename: 'OWASP_SECURITY_ZERO_TRUST.md',
        description: 'Strict security posture: injection prevention, cryptographic hashing, SSRF/XSS sanitization, and access control.',
        markdownContent: `# 🛡️ OWASP Top 10 & Zero-Trust Security Rulebook (v4.0)

## Section 1: Injection Prevention (A03:2021)
- **SEC-01 (SQL / NoSQL Injection)**: String concatenation or unchecked interpolation in database queries, ORM \`FromSqlRaw\`, or raw MongoDB filters is a CRITICAL blocking violation.
- **SEC-02 (Command Injection)**: Never pass unsanitized user input to system shell execution (\`child_process.exec\`, \`Process.Start\`, \`Runtime.getRuntime().exec\`).

## Section 2: Cryptographic Failures (A02:2021)
- **SEC-03 (Password & Secret Hashing)**: Passwords and sensitive tokens must be hashed using Argon2id, PBKDF2, or BCrypt with appropriate work factor. Never use MD5, SHA-1, or plain SHA-256 for passwords.
- **SEC-04 (Safe Cryptographic Comparison)**: Comparison of signatures, webhook secrets, or tokens must use constant-time comparisons (\`CryptographicOperations.FixedTimeEquals\` / \`crypto.timingSafeEqual\`).

## Section 3: Sensitive Data & Authentication (A01:2021 & A07:2021)
- **SEC-05 (Zero Hardcoded Credentials)**: No API keys, JWT signing keys, or certificates in source files or git history.
- **SEC-06 (Rate Limiting & Anti-Brute Force)**: Public API endpoints and authentication routes must implement rate limiting filters (e.g. Bucket4j or ASP.NET Core RateLimiter).
`
    },
    {
        id: 'strict-tdd',
        name: 'Strict Test-Driven & High Coverage Policy',
        filename: 'STRICT_TDD_COVERAGE.md',
        description: 'Strict QA policy requiring 100% test coverage for newly added business classes and negative error assertions.',
        markdownContent: `# 🧪 Strict TDD & PR Coverage Verification Policy (v3.1)

## Section 1: Coverage Thresholds
- **TEST-01 (Line Coverage)**: PR changeset must maintain minimum 85% line coverage. Below 80% triggers automatic Quality Gate REJECTION.
- **TEST-02 (Branch Coverage)**: Minimum 75% branch coverage required for conditional logic (\`if/else\`, \`switch\`, ternary operators).

## Section 2: Test Case Requirements
- **TEST-03 (Negative Scenarios)**: Every public API endpoint or service method must have at least 1 test asserting proper exception throwing upon invalid input.
- **TEST-04 (Mocking Isolation)**: Unit tests must isolate external dependencies (Stripe, Twilio, Database) using mocks or test containers. Never invoke external production APIs in test suites.
`
    },
    {
        id: 'custom',
        name: 'Custom Organization Guidelines (.md)',
        filename: 'CUSTOM_ORGANIZATION_RULES.md',
        description: 'Your organization\'s custom code standard guidelines and review conventions.',
        markdownContent: `# 📋 Custom Organization Engineering Standards (.md)

## Section 1: Team Coding Conventions
- **RULE 1.1**: Maintain clean folder structure and follow idiomatic naming conventions.
- **RULE 1.2**: Document all public APIs and export interfaces with JSDoc or XML documentation.
- **RULE 1.3**: Catch specific exceptions; never use catch-all blocks that silently swallow errors.

## Section 2: Pull Request Quality Gate
- **RULE 2.1**: All new methods must be covered by automated tests.
- **RULE 2.2**: PR diffs should be focused and avoid bundling unrelated refactoring.
`
    }
];

export class StandardsManager {
    private static STORAGE_KEY = 'mulan_active_standard_id';
    private static CUSTOM_CONTENT_KEY = 'mulan_custom_standard_content';

    static getAvailableStandards(): MarkdownStandard[] {
        const standards = [...PRESET_MARKDOWN_STANDARDS];
        if (typeof localStorage !== 'undefined') {
            const savedCustom = localStorage.getItem(this.CUSTOM_CONTENT_KEY);
            if (savedCustom) {
                const customIdx = standards.findIndex(s => s.id === 'custom');
                if (customIdx !== -1) {
                    standards[customIdx].markdownContent = savedCustom;
                }
            }
        }
        return standards;
    }

    static getActiveStandard(): MarkdownStandard {
        const available = this.getAvailableStandards();
        if (typeof localStorage !== 'undefined') {
            const activeId = localStorage.getItem(this.STORAGE_KEY);
            const found = available.find(s => s.id === activeId);
            if (found) return found;
        }
        return available[0];
    }

    static setActiveStandard(id: string): void {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(this.STORAGE_KEY, id);
        }
    }

    static saveCustomContent(content: string): void {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(this.CUSTOM_CONTENT_KEY, content);
        }
    }
}

export const SYSTEM_PROMPT_TEMPLATE = `You are a Senior Principal Code Reviewer and Lead Security Architect.
You are reviewing a Pull Request diff against strict Organization Code Standards provided in Markdown (.md) format.

Your review MUST be grounded in the active Code Standards Markdown file:
{ACTIVE_STANDARD_MD}

Evaluation Guidelines:
1. Ground every finding in a specific rule from the Code Standards Markdown file where applicable (e.g. [Rule 3.1: SQL Injection], [Rule 2.1: Cancellation Token]).
2. Provide exact file names, line numbers, severity levels, detailed remediation explanations, and clean replacement code blocks.
3. Assess overall quality score (0-100), security health (0-100), test readiness (0-100), and an executive merge verdict (APPROVE / REQUEST_CHANGES / COMMENT).

Always return your review in valid JSON format matching this schema:
{
  "overallSummary": "Brief executive summary of the PR impact and readiness against the .md standards",
  "scorecard": {
    "qualityScore": 85,
    "securityScore": 90,
    "testReadiness": 75,
    "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    "verdict": "APPROVE" | "REQUEST_CHANGES" | "COMMENT"
  },
  "issues": [
    {
      "file": "path/to/file",
      "line": 42,
      "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO",
      "category": "security" | "performance" | "quality" | "testing" | "architecture",
      "title": "[Rule 3.1] Short title of the violation",
      "comment": "In-depth explanation referencing the active .md standard section",
      "suggestion": "Specific code snippet or fix suggestion"
    }
  ],
  "positiveHighlights": [
    "What was done well according to the .md standards"
  ]
}
`;

