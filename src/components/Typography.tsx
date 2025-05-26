export const PrimaryTitle = ({ children }: { children: React.ReactNode }) => (
  <h1 className="text-center text-3xl font-bold">{children}</h1>
);

export const SecondaryTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-semibold mb-2">{children}</h2>
);

export const TertiaryTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xl font-semibold mb-2">{children}</h3>
);

export const QuaternaryTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => <h4 className="text-lg font-semibold mt-4">{children}</h4>;

export const Text = ({ children }: { children: React.ReactNode }) => (
  <p className="text-primary/80 dark:text-white/70">{children}</p>
);
