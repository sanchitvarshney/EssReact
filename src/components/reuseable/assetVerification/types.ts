import dummyImg from "../../../assets/gallery.png";

export interface AssetItem {
  id: string;
  assetTxnId: number | string;
  name: string;
  category: string;
  model: string;
  code: string;
  status: string;
  description: string;
  allotedOn: string;
  deviceAge: string;
  image: string;
  images: string[];
}

/** A user-typed row from the "Add Asset" dialog (not from the official catalog). */
export interface AddedAssetEntry {
  id: string;
  name: string;
  remark: string;
}

export const ACCENT = "#2eacb3";
export const DISPUTE_RED = "#ef4444";

export const isImageFile = (url: string) => {
  const ext = url?.split(".")?.pop()?.toLowerCase();
  return ["jpg", "jpeg", "png", "webp"].includes(ext || "");
};

export const mapAssetItem = (item: any): AssetItem => {
  const validImages = (Array.isArray(item.images) ? item.images : []).filter(
    isImageFile,
  );
  const allotedParts = String(item.alloted_dt || "").split(" | ");

  return {
    id: String(item.identity),
    assetTxnId: item.asset_txn_id ?? item.identity,
    name: item.name,
    category: item.category || item.catergory || "Device",
    model: item.model || "",
    code: item.serial || "",
    status: item.status || "",
    description: item.description || "",
    allotedOn: allotedParts[0] || "",
    deviceAge: allotedParts.slice(1).join(" | ") || "",
    image: validImages[0] || dummyImg,
    images: validImages.length ? validImages : [dummyImg],
  };
};
