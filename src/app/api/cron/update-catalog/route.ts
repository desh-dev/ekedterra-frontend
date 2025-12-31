import { getProducts } from "@/lib/data/server";
import { Product } from "@/lib/graphql/types";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

// Meta Product Catalog required fields
interface MetaProduct {
  id: string;
  title: string;
  description: string;
  availability: "in stock" | "out of stock";
  condition: "new" | "used";
  price: string;
  link: string;
  image_link: string;
  brand: string;
  // Optional but recommended
  sale_price?: string;
  google_product_category?: string;
  fb_product_category?: string;
  quantity_to_sell_on_facebook?: string;
  sale_price_effective_date?: string;
  item_group_id?: string;
  gender?: string;
  age_group?: string;
  color?: string;
  size?: string;
  material?: string;
  pattern?: string;
  shipping?: string;
  shipping_weight?: string;
  video_url?: string;
  video_tag?: string;
  gtin?: string;
  product_tags?: string;
  style?: string;
}

// Verify cron secret for security
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Fetch products from your backend
    const products = await getProducts();

    // 2. Transform to Meta format
    const metaProducts = transformToMetaFormat(products);

    // 3. Update Google Sheet
    await updateGoogleSheet(metaProducts);

    return NextResponse.json({
      success: true,
      productsUpdated: metaProducts.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json(
      {
        error: "Failed to update catalog",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function transformToMetaFormat(products: Product[]): MetaProduct[] {
  if (!products || !Array.isArray(products)) {
    return [];
  }

  return products?.map((product) => ({
    id: product.id.toString(),
    title: product.name,
    description: product.description,
    availability: product.stock > 0 ? "in stock" : "out of stock",
    condition: "new",
    price: `${product.price} XAF`,
    link: `https://ekedterra.com/fr/shop/${product.id}`,
    image_link: product.mainImage,
    brand: product.name.split(" ")[0],
    // Optional fields
    additional_image_link: product.images?.[1],
    sale_price: product.salePrice ? `${product.salePrice} XAF` : undefined,
    google_product_category: product.category,
    fb_product_category: product.category,
  }));
}

async function updateGoogleSheet(products: MetaProduct[]) {
  // Initialize Google Sheets API
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  // Meta catalog required headers
  const headers = [
    "id",
    "title",
    "description",
    "availability",
    "condition",
    "price",
    "link",
    "image_link",
    "brand",
    "sale_price",
    "sale_price_effective_date",
    "item_group_id",
    "google_product_category",
    "fb_product_category",
    "product_type",
    "gender",
    "age_group",
    "color",
    "size",
    "material",
    "pattern",
    "shipping",
    "shipping_weight",
    "gtin",
    "style[0]",
    "product_tags",
    "video[0].url",
    "video[0].tag",
  ];

  // Convert products to rows
  const rows = products.map((product) =>
    headers.map((header) => product[header as keyof MetaProduct] || "")
  );

  // Clear existing data and write new data
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: "AllProducts!A:Z",
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "AllProducts!A1",
    valueInputOption: "RAW",
    requestBody: {
      values: [headers, ...rows],
    },
  });
}
