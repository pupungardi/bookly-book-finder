/**
 * Small compatibility layer so the pages/components ported from the original
 * Next.js codebase keep working on TanStack Router.
 */
import { useRouter as useTanstackRouter } from "@tanstack/react-router";
import { useCallback, useMemo, type ImgHTMLAttributes } from "react";

export function useRouter() {
  const router = useTanstackRouter();

  const push = useCallback(
    (href: string) => {
      void router.navigate({ to: href, resetScroll: true });
    },
    [router],
  );

  const replace = useCallback(
    (href: string) => {
      void router.navigate({ to: href, replace: true, resetScroll: true });
    },
    [router],
  );

  const back = useCallback(() => {
    router.history.back();
  }, [router]);

  return useMemo(
    () => ({ push, replace, back, prefetch: () => {}, refresh: () => router.invalidate() }),
    [push, replace, back, router],
  );
}

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "loading"> & {
  fill?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
  sizes?: string;
  quality?: number;
  width?: number | string;
  height?: number | string;
};

export function Image({
  fill,
  priority,
  unoptimized,
  quality,
  style,
  alt,
  ...rest
}: ImageProps) {
  return (
    <img
      alt={alt ?? ""}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      style={
        fill
          ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...style }
          : style
      }
      {...rest}
    />
  );
}

export default Image;
