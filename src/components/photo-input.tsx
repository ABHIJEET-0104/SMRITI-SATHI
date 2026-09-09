import { useRef, useState } from "react";

/**
 * Reads a photo, scales it down in the browser and hands back a compact
 * data URL. Keeping the photo with the record means the games still work
 * with no internet connection.
 */
export function PhotoInput({
  value,
  onChange,
  label,
}: {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  label: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("That file is not a photo. Please choose a JPG or PNG image.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("That photo is too large. Please choose one under 8 MB.");
      return;
    }
    try {
      const dataUrl = await resize(file, 420);
      onChange(dataUrl);
    } catch {
      setError("That photo could not be read. Please try another one.");
    }
  }

  return (
    <div className="grid gap-2">
      <span className="text-sm font-semibold">{label}</span>
      <div className="flex items-center gap-3">
        <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-secondary text-xs text-muted-foreground">
          {value ? (
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <span>No photo</span>
          )}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => void handleFile(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="min-h-11 rounded-xl border border-border bg-card px-4 text-sm font-semibold"
        >
          Choose photo
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="min-h-11 rounded-xl px-3 text-sm font-semibold text-destructive"
          >
            Remove
          </button>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

function resize(file: File, max: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("decode failed"));
      image.onload = () => {
        const scale = Math.min(1, max / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("canvas unavailable"));
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
