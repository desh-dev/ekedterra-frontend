import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async ({ locale }) => {
  const store = await cookies();
  const currentLocale = store.get("locale")?.value || locale || "fr";

  return {
    locale: currentLocale,
    messages: (await import(`../app/messages/${currentLocale}.json`)).default,
  };
});
