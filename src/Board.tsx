import { useMemo } from "react";
import { Tldraw, TLAssetStore } from "tldraw";
import { useSync } from "@tldraw/sync";
import { useParams } from "wouter";
import "tldraw/tldraw.css";

/**
 * Delete a nested property from `obj` at the given path.
 * e.g. deletePath(shape, ["props", "richText", "attrs"]) deletes shape.props.richText.attrs
 */

const assets: TLAssetStore = {
  upload: async () => "",
  resolve: (asset) => asset.props.src,
};

export function Board() {
  const { slug } = useParams<{ slug: string }>();
  const decodedSlug = decodeURIComponent(slug!);

  const uri = useMemo(
    () => `ws://${import.meta.env.VITE_SERVER_URL}/api/rooms/${encodeURIComponent(decodedSlug)}`,
    [decodedSlug],
  );

  const store = useSync({ uri, assets });

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw store={store} />
    </div>
  );
}
