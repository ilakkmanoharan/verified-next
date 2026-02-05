import NextLink from "next/link";

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function Link({ href, children, className = "" }: LinkProps) {
  return (
    <NextLink
      href={href}
      className={`text-blue-400 hover:text-blue-300 underline underline-offset-2 ${className}`}
    >
      {children}
    </NextLink>
  );
}
