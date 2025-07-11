// lib/auth-redirect.js

/**
 * Handle redirect after login
 */
export function handleLoginRedirect(router) {
  const redirectPath = sessionStorage.getItem("redirectAfterLogin");
  if (redirectPath) {
    sessionStorage.removeItem("redirectAfterLogin");
    router.push(redirectPath);
  } else {
    router.push("/dashboard/portfolios");
  }
}
