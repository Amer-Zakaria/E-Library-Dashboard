// routerService.ts
import type { RouterType } from 'src/routes/hooks/use-router';

let routerRef: RouterType | null = null;

export function setRouter(router: RouterType): void {
  routerRef = router;
}

export function getRouter(): RouterType | null {
  return routerRef;
}
