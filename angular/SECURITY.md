# Security Notes

## Known Vulnerabilities

This project uses Angular 18.x which has known vulnerabilities in its dependencies. These are primarily in development dependencies and do not affect production builds.

### Vulnerabilities:
- **Angular Core/Compiler**: XSS vulnerabilities (fixed in Angular 19+)
- **esbuild**: Development server request vulnerability
- **tar/minimatch**: Path traversal and ReDoS issues
- **ajv**: ReDoS vulnerability

### Mitigation:
- All vulnerabilities are in **dev dependencies** only
- Production builds are not affected
- To fully resolve, upgrade to Angular 21+ (breaking changes required)

### For Production Use:
Run `npm audit fix --force` to upgrade to Angular 21, but note this requires code changes for breaking changes.

## Recommendation:
This is a **demo/portfolio project**. For production use, upgrade to the latest Angular version.
