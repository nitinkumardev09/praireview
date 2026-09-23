export interface PullRequestMetadata {
    id: number;
    number: number;
    title: string;
    body: string;
    state: string;
    author: {
        login: string;
        avatar_url: string;
    };
    created_at: string;
    updated_at: string;
    base_branch: string;
    head_branch: string;
    additions: number;
    deletions: number;
    changed_files: number;
    commits: number;
    html_url: string;
    repo: string;
}

export interface PullRequestFile {
    filename: string;
    status: 'added' | 'modified' | 'removed' | 'renamed';
    additions: number;
    deletions: number;
    changes: number;
    patch?: string;
    raw_url?: string;
}

export interface RateLimitInfo {
    limit: number;
    remaining: number;
    reset: number;
}

export class GitHubService {
    private static token: string = '';

    static setToken(token: string) {
        this.token = token.trim();
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('mulan_github_token', this.token);
        }
    }

    static getToken(): string {
        if (!this.token && typeof localStorage !== 'undefined') {
            this.token = localStorage.getItem('mulan_github_token') || '';
        }
        return this.token;
    }

    private static getHeaders(): HeadersInit {
        const headers: Record<string, string> = {
            'Accept': 'application/vnd.github.v3+json',
        };
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `token ${token}`;
        }
        return headers;
    }

    static parsePrInput(input: string, explicitNumber?: number | string): { owner: string; repo: string; prNumber: number } | null {
        const trimmed = input.trim();
        // Check if URL format: https://github.com/owner/repo/pull/123
        const urlMatch = trimmed.match(/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/i);
        if (urlMatch) {
            return {
                owner: urlMatch[1],
                repo: urlMatch[2],
                prNumber: parseInt(urlMatch[3], 10)
            };
        }

        // Check if owner/repo format
        const repoMatch = trimmed.match(/^([^\/]+)\/([^\/#]+)(?:#(\d+))?$/);
        if (repoMatch) {
            const num = repoMatch[3] ? parseInt(repoMatch[3], 10) : (explicitNumber ? parseInt(String(explicitNumber), 10) : null);
            if (num && !isNaN(num)) {
                return {
                    owner: repoMatch[1],
                    repo: repoMatch[2],
                    prNumber: num
                };
            }
        }

        return null;
    }

    static async fetchPullRequest(owner: string, repo: string, prNumber: number): Promise<PullRequestMetadata> {
        // First check preset mocks
        const mock = this.getMockPullRequest(owner, repo, prNumber);
        if (mock) {
            return mock;
        }

        const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;
        const res = await fetch(url, { headers: this.getHeaders() });
        
        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(`GitHub API Error (${res.status}): ${errBody.message || res.statusText}`);
        }

        const data = await res.json();
        return {
            id: data.id,
            number: data.number,
            title: data.title,
            body: data.body || '',
            state: data.state,
            author: {
                login: data.user?.login || 'anonymous',
                avatar_url: data.user?.avatar_url || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
            },
            created_at: data.created_at,
            updated_at: data.updated_at,
            base_branch: data.base?.ref || 'main',
            head_branch: data.head?.ref || 'feature-branch',
            additions: data.additions || 0,
            deletions: data.deletions || 0,
            changed_files: data.changed_files || 0,
            commits: data.commits || 1,
            html_url: data.html_url,
            repo: `${owner}/${repo}`
        };
    }

    static async fetchPullRequestFiles(owner: string, repo: string, prNumber: number): Promise<PullRequestFile[]> {
        const mockFiles = this.getMockFiles(owner, repo, prNumber);
        if (mockFiles) {
            return mockFiles;
        }

        const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files?per_page=100`;
        const res = await fetch(url, { headers: this.getHeaders() });
        
        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(`GitHub API Error fetching files (${res.status}): ${errBody.message || res.statusText}`);
        }

        const data = await res.json();
        return data.map((f: any) => ({
            filename: f.filename,
            status: f.status,
            additions: f.additions,
            deletions: f.deletions,
            changes: f.changes,
            patch: f.patch || '',
            raw_url: f.raw_url
        }));
    }

    static async fetchRateLimit(): Promise<RateLimitInfo | null> {
        try {
            const res = await fetch('https://api.github.com/rate_limit', { headers: this.getHeaders() });
            if (res.ok) {
                const data = await res.json();
                return {
                    limit: data.rate.limit,
                    remaining: data.rate.remaining,
                    reset: data.rate.reset
                };
            }
        } catch {
            // ignore
        }
        return null;
    }

    // --- Demo & Mock PR Presets for Instant Testing ---
    static getPresets() {
        return [
            {
                id: 'preset-dotnet',
                label: '.NET 8 C# Web API (Order & Payment Service)',
                owner: 'enterprise-net',
                repo: 'order-api',
                prNumber: 42,
                stack: '.NET / C#'
            },
            {
                id: 'preset-react',
                label: 'React 18 / TypeScript (User Auth & Dashboard UI)',
                owner: 'acme-ui',
                repo: 'dashboard-frontend',
                prNumber: 108,
                stack: 'React / TS'
            },
            {
                id: 'preset-java',
                label: 'Java Spring Boot 3 (Secure Payment Gateway)',
                owner: 'fintech-org',
                repo: 'payment-microservice',
                prNumber: 89,
                stack: 'Java Spring Boot'
            },
            {
                id: 'preset-angular',
                label: 'Angular / Vue UI (Multi-tenancy Client)',
                owner: 'cloud-apps',
                repo: 'web-portal',
                prNumber: 312,
                stack: 'Angular / UI'
            }
        ];
    }

    private static getMockPullRequest(owner: string, repo: string, prNumber: number): PullRequestMetadata | null {
        if (owner === 'enterprise-net' && repo === 'order-api') {
            return {
                id: 100042,
                number: 42,
                title: 'feat(payments): Add high-throughput Stripe checkout & bulk order processor',
                body: `### Description
This PR integrates Stripe payment webhooks, adds bulk order batching in ASP.NET Core 8 Web API, and adds a repository query.

### Changes
- Updated \`OrderProcessingService.cs\` to process payments asynchronously.
- Added raw SQL query in \`OrderRepository.cs\` for bulk export performance.
- Added unit tests in \`OrderProcessingServiceTests.cs\`.`,
                state: 'open',
                author: {
                    login: 'david-netdev',
                    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                },
                created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
                updated_at: new Date().toISOString(),
                base_branch: 'main',
                head_branch: 'feature/stripe-payments',
                additions: 184,
                deletions: 29,
                changed_files: 3,
                commits: 4,
                html_url: 'https://github.com/enterprise-net/order-api/pull/42',
                repo: 'enterprise-net/order-api'
            };
        }

        if (owner === 'acme-ui' && repo === 'dashboard-frontend') {
            return {
                id: 100108,
                number: 108,
                title: 'feat(auth): Upgrade OAuth2 token refresh and add real-time notification socket',
                body: `### Summary
- Implemented automatic token refresh interceptor using Axios.
- Integrated WebSocket connection inside React \`NotificationBadge\` component.
- Added state persistence with localStorage.`,
                state: 'open',
                author: {
                    login: 'sarah-frontend',
                    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
                },
                created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
                updated_at: new Date().toISOString(),
                base_branch: 'main',
                head_branch: 'feat/token-refresh',
                additions: 142,
                deletions: 38,
                changed_files: 3,
                commits: 2,
                html_url: 'https://github.com/acme-ui/dashboard-frontend/pull/108',
                repo: 'acme-ui/dashboard-frontend'
            };
        }

        if (owner === 'fintech-org' && repo === 'payment-microservice') {
            return {
                id: 100089,
                number: 89,
                title: 'security(crypto): Migrate hashing to Argon2id and add rate-limiting filter',
                body: `### Security Enhancements
- Upgraded password and secret hashing algorithm to Argon2id.
- Added Bucket4j rate-limiting filter on the \`/api/v1/auth/login\` and \`/api/v1/transfer\` endpoints.
- JaCoCo coverage updated to 88%.`,
                state: 'open',
                author: {
                    login: 'alex-seceng',
                    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
                },
                created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
                updated_at: new Date().toISOString(),
                base_branch: 'master',
                head_branch: 'security/argon2-rate-limit',
                additions: 215,
                deletions: 45,
                changed_files: 3,
                commits: 5,
                html_url: 'https://github.com/fintech-org/payment-microservice/pull/89',
                repo: 'fintech-org/payment-microservice'
            };
        }

        if (owner === 'cloud-apps' && repo === 'web-portal') {
            return {
                id: 100312,
                number: 312,
                title: 'refactor(tenant): Dynamic tenant routing and lazy-loaded billing module',
                body: `### Features
- Support dynamic multi-tenancy URL routing.
- Converted Billing module to lazy loading chunk.`,
                state: 'open',
                author: {
                    login: 'elena-dev',
                    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80'
                },
                created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
                updated_at: new Date().toISOString(),
                base_branch: 'main',
                head_branch: 'tenant-routing',
                additions: 98,
                deletions: 14,
                changed_files: 2,
                commits: 2,
                html_url: 'https://github.com/cloud-apps/web-portal/pull/312',
                repo: 'cloud-apps/web-portal'
            };
        }

        return null;
    }

    private static getMockFiles(owner: string, repo: string, prNumber: number): PullRequestFile[] | null {
        if (owner === 'enterprise-net' && repo === 'order-api') {
            return [
                {
                    filename: 'src/Services/OrderProcessingService.cs',
                    status: 'modified',
                    additions: 68,
                    deletions: 12,
                    changes: 80,
                    patch: `@@ -45,12 +45,34 @@ public class OrderProcessingService : IOrderProcessingService
     private readonly ILogger<OrderProcessingService> _logger;
     private readonly IPaymentGateway _paymentGateway;
+    private readonly IConfiguration _config;
 
-    public OrderProcessingService(ILogger<OrderProcessingService> logger, IPaymentGateway gateway)
+    public OrderProcessingService(ILogger<OrderProcessingService> logger, IPaymentGateway gateway, IConfiguration config)
     {
         _logger = logger;
         _paymentGateway = gateway;
+        _config = config;
     }
 
-    public async Task<OrderResult> ProcessPaymentAsync(Order order)
+    public async Task<OrderResult> ProcessPaymentAsync(Order order, CancellationToken ct = default)
     {
+        // Hardcoded fallback webhook secret for dev testing
+        var stripeSecret = _config["Stripe:SecretKey"] ?? "sk_test_51Mz982348923489234ABCDExyz123456";
+        
+        if (order.TotalAmount <= 0)
+            throw new ArgumentException("Order amount must be positive");
+            
+        _logger.LogInformation("Initiating payment for Order #{OrderId} with amount {Amount}", order.Id, order.TotalAmount);
+        
+        // Potential fire-and-forget without error boundary
+        Task.Run(async () => {
+            await SyncAnalyticsMetrics(order.Id);
+        });
+
+        var charge = await _paymentGateway.ChargeAsync(order.CustomerEmail, order.TotalAmount, stripeSecret, ct);
+        return new OrderResult { Success = charge.IsSuccess, TransactionId = charge.Id };
     }`
                },
                {
                    filename: 'src/Repositories/OrderRepository.cs',
                    status: 'modified',
                    additions: 38,
                    deletions: 5,
                    changes: 43,
                    patch: `@@ -88,5 +88,25 @@ public async Task<IEnumerable<Order>> SearchOrdersAsync(string customerName, string status)
     {
-        return await _dbContext.Orders.Where(o => o.CustomerName.Contains(customerName)).ToListAsync();
+        // Vulnerable raw SQL string concatenation
+        var query = "SELECT * FROM Orders WHERE CustomerName = '" + customerName + "' AND Status = '" + status + "'";
+        
+        using var connection = new SqlConnection(_connectionString);
+        await connection.OpenAsync();
+        
+        using var command = new SqlCommand(query, connection);
+        using var reader = await command.ExecuteReaderAsync();
+        
+        var list = new List<Order>();
+        while (await reader.ReadAsync())
+        {
+            list.Add(MapOrder(reader));
+        }
+        return list;
     }`
                },
                {
                    filename: 'tests/OrderApi.Tests/OrderProcessingServiceTests.cs',
                    status: 'added',
                    additions: 78,
                    deletions: 0,
                    changes: 78,
                    patch: `@@ -0,0 +1,78 @@
+using Xunit;
+using Moq;
+using Microsoft.Extensions.Logging;
+
+namespace OrderApi.Tests;
+
+public class OrderProcessingServiceTests
+{
+    [Fact]
+    public async Task ProcessPayment_ValidOrder_ReturnsSuccess()
+    {
+        // Arrange
+        var mockLogger = new Mock<ILogger<OrderProcessingService>>();
+        var mockGateway = new Mock<IPaymentGateway>();
+        var mockConfig = new Mock<IConfiguration>();
+        mockGateway.Setup(g => g.ChargeAsync(It.IsAny<string>(), It.IsAny<decimal>(), It.IsAny<string>(), It.IsAny<CancellationToken>()))
+                   .ReturnsAsync(new PaymentChargeResult { IsSuccess = true, Id = "ch_123" });
+
+        var service = new OrderProcessingService(mockLogger.Object, mockGateway.Object, mockConfig.Object);
+        var order = new Order { Id = 1, CustomerEmail = "test@example.com", TotalAmount = 99.50m };
+
+        // Act
+        var result = await service.ProcessPaymentAsync(order);
+
+        // Assert
+        Assert.True(result.Success);
+        Assert.Equal("ch_123", result.TransactionId);
+    }
+}`
                }
            ];
        }

        if (owner === 'acme-ui' && repo === 'dashboard-frontend') {
            return [
                {
                    filename: 'src/api/authInterceptor.ts',
                    status: 'modified',
                    additions: 52,
                    deletions: 16,
                    changes: 68,
                    patch: `@@ -20,16 +20,38 @@ axiosInstance.interceptors.response.use(
     (response) => response,
     async (error) => {
         const originalRequest = error.config;
-        if (error.response?.status === 401 && !originalRequest._retry) {
+        if (error.response?.status === 401 && !originalRequest._retry) {
             originalRequest._retry = true;
-            const refreshed = await refreshToken();
-            return axiosInstance(originalRequest);
+            try {
+                const refreshTokenValue = localStorage.getItem('refreshToken');
+                const res = await axios.post('/api/auth/refresh', { token: refreshTokenValue });
+                const { accessToken, newRefreshToken } = res.data;
+                
+                localStorage.setItem('accessToken', accessToken);
+                localStorage.setItem('refreshToken', newRefreshToken);
+                
+                originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
+                return axiosInstance(originalRequest);
+            } catch (refreshErr) {
+                // Possible token refresh loop if 401 occurs repeatedly
+                window.location.href = '/login';
+                return Promise.reject(refreshErr);
+            }
         }
         return Promise.reject(error);
     }
 );`
                },
                {
                    filename: 'src/components/NotificationBadge.tsx',
                    status: 'modified',
                    additions: 45,
                    deletions: 12,
                    changes: 57,
                    patch: `@@ -10,12 +10,32 @@ export const NotificationBadge: React.FC = () => {
     const [count, setCount] = useState<number>(0);
     const [connected, setConnected] = useState<boolean>(false);
 
     useEffect(() => {
-        fetchNotifications().then(setCount);
+        const wsUrl = \`wss://api.example.com/notifications?token=\${localStorage.getItem('accessToken')}\`;
+        const socket = new WebSocket(wsUrl);
+        
+        socket.onopen = () => setConnected(true);
+        socket.onmessage = (event) => {
+            const data = JSON.parse(event.data);
+            setCount(prev => prev + data.unreadIncrement);
+        };
+        
+        // Missing cleanup: socket is not closed on component unmount
     }, []);
 
     return (
         <div className="notification-badge" onClick={() => setCount(0)}>
-            <span>{count}</span>
+            <span className={connected ? 'status-online' : 'status-offline'}>{count}</span>
         </div>
     );
 };`
                }
            ];
        }

        return null;
    }
}
