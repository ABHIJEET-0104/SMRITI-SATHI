/** Shows a family photo, or a large readable initial when none was added. */
export function FaceTile({
  photoUrl,
  name,
  className = "",
}: {
  photoUrl?: string | null;
  name: string;
  className?: string;
}) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={`Photo of ${name}`}
        className={`size-full object-cover ${className}`}
      />
    );
  }
  return (
    <span
      className={`gradient-primary grid size-full place-items-center font-display text-6xl font-bold text-primary-foreground ${className}`}
      aria-label={`No photo for ${name}`}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
