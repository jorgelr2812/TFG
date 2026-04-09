// Placeholder auth middleware
// In production, implement proper JWT verification with Supabase
export const authenticate = (req, res, next) => {
  // For now, allow all requests
  // TODO: Verify Supabase JWT token
  next();
};